#run this to install the dependencies


cd "finalproject/anti-counterfeit-product-identification-system-using-blockchain/identeefi-frontend-react" ; 
ls
write-host "downloading the package "
npm install --legacy-peer-deps ; 
npm audit fix ;
npm run start ;

cd "finalproject/anti-counterfeit-product-identification-system/smartcontract-solidty";
ls
write-host "downloading the package "
npm install ; 
npm install npx ; 
npm audit fix ;             

cd "finalproject/anti-counterfeit-product-identification-system-using-blockchain/server" ;
ls
write-host "downloading the package "
npm i ;
npm audit fix ;
