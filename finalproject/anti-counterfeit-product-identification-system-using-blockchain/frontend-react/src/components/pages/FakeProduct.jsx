import { Box, Paper, Avatar, Typography, Button } from '@mui/material';
import bgImg from '../../img/bg.png';
import { useNavigate } from 'react-router-dom';

const FakeProduct = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-2)
    }

    return (
        <Box sx={{
            backgroundImage: `url(${bgImg})`,
            minHeight: "80vh",
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: -2,
            overflowY: "scroll"
        }}>

            <Paper elevation={3} sx={{ width: "400px", margin: "auto", marginTop: "10%", marginBottom: "10%", padding: "3%", backgroundColor: "#e3eefc" }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "Montserrat",
                        textAlign: "center", marginBottom: "5%", marginTop: "5%", 
                    }}    
                >
                   Fake Detected
                </Typography>
                <Typography
                variant="h5"
                sx={{
                    fontFamily: "Montserrat",
                    textAlign: "center", marginBottom: "5%", marginTop: "5%", 
                }}   >
                   product you scanned is not authentic. It appears to be a counterfeit.
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: "Montserrat",
                        textAlign: "center", marginBottom: "5%", marginTop: "5%", 
                    }}    
                >
                    please contact the manufacturer of the genuine product for further assistance.
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: "Montserrat",
                        textAlign: "center", marginBottom: "5%", marginTop: "5%", 
                    }}    
                >
                    Thank you for using our anti-counterfeit.
                </Typography>


                

                <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >


                        <Button
                            onClick={handleBack}
                            sx={{
                                marginTop: "5%",
                            }}
                        >
                            Back
                        </Button>

                    </Box>    
 
            </Paper>
        </Box>


    
    )
}

export default FakeProduct;