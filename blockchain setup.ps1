cd finalproject ;
cd (ls)[0]; 
cd (ls)[1];
npx hardhat compile;
npx hardhat run scripts/deploy.js --network ganache

node "c:\Users\rohan\OneDrive\Desktop\BBNS\finalproject\anti-counterfeit-product-identification-system-using-blockchain\server\postgres.js"

cd ..; 
cd (ls)[0] ;

npm run build ;
serve -s build ;