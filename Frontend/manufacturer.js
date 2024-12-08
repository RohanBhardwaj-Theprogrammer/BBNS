document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('product-form');
  const qrCodeResult = document.getElementById('qr-code-result');
  const loadingSpinner = document.getElementById('loading');

  // Check for MetaMask installation
  async function checkMetaMask() {
    if (typeof window.ethereum === 'undefined') {
      const installMetaMask = confirm(
        'MetaMask is not installed. Would you like to install it now?'
      );
      if (installMetaMask) {
        // Redirect to MetaMask installation page
        window.location.href = 'https://metamask.io/download.html';
      } else {
        alert('MetaMask is required to use this application.');
        window.location.href = '/'; // Redirect to the default page
      }
      return false;
    }
    return true;
  }

  // Initialize MetaMask
  async function initializeMetaMask() {
    const isMetaMaskAvailable = await checkMetaMask();
    if (!isMetaMaskAvailable) return;

    try {
      // Request wallet connection
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('User denied MetaMask connection:', error);
      alert('MetaMask connection is required to continue.');
      window.location.href = '/'; // Redirect to the default page
    }
  }

  // Form submission handler
  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Show loading spinner
    loadingSpinner.classList.remove('hidden');

    // Collect form data
    const productName = document.getElementById('product-name').value;
    const productCategory = document.getElementById('product-category').value;
    const productPhoto = document.getElementById('product-photo').files[0];
    const productPrice = document.getElementById('product-price').value;
    const productDescription = document.getElementById('product-description').value;

    // Validation check
    if (!productName || !productCategory || !productPrice || !productDescription || !productPhoto) {
      alert('Please fill in all fields and upload an image.');
      loadingSpinner.classList.add('hidden');
      return;
    }

    // MetaMask initialization
    await initializeMetaMask();

    try {
      // Interact with MetaMask
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];

      // Prepare product data
      const productData = {
        manufacturerId: '1', // Mock ID for now
        productName,
        category: productCategory,
        price: productPrice,
        description: productDescription,
        photoUrl: URL.createObjectURL(productPhoto), // Replace with backend storage in real applications
        walletAddress,
      };

      // Verify manufacturer
      const verifyResponse = await fetch('http://localhost:3000/api/verifyManufacturer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manufacturerId: productData.manufacturerId,
          walletAddress,
        }),
      });

      const verifyResult = await verifyResponse.json();
      if (verifyResult.status !== 'verified') {
        alert('Manufacturer verification failed.');
        loadingSpinner.classList.add('hidden');
        return;
      }

      // Add product to blockchain
      const addResponse = await fetch('http://localhost:3000/api/addProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const addResult = await addResponse.json();
      if (addResult.status === 'success') {
        qrCodeResult.innerHTML = `
          <h4>Product Added Successfully!</h4>
          <p><strong>Transaction Hash:</strong> ${addResult.txHash}</p>
        `;
      } else {
        alert('Failed to add product to blockchain.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      loadingSpinner.classList.add('hidden');
    }
  });

  // Perform MetaMask check on page load
  checkMetaMask();
});
