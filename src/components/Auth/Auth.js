import React,{useState} from 'react'
import {Avatar,Button,Paper,Grid,Typography,Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {GoogleLogin} from 'react-google-login';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import useStyles from './styles';
import Icon from './icon';
import Input from './Input';
import {signin,signup} from '../../actions/auth';

const initialState={firstName:'',lastName:'',email:'',password:'',confirmPassword:''}

 const Auth = () => {
    const classes=useStyles();

    const [showPassword,setShowPassoword]=useState(false);
    const [isSignup,setIsSignup]=useState(false);
    const [formData,setFormData]=useState(initialState);
    const dispatch = useDispatch();
    const history=useHistory();

    const handleShowPassword=()=>setShowPassoword((prevShowPassword)=>!prevShowPassword)

    const handleSubmit=(e)=>{
      e.preventDefault();
      console.log('click');
     if(isSignup){
        dispatch(signup(formData,history))
     }else{
      dispatch(signin(formData,history))
     }
    };

    const handleChange=(e)=>{

      setFormData({
           ...formData,[e.target.name]:e.target.value})
       
          }

    const switchMode=()=>{
      setIsSignup((previsSignup)=>!previsSignup);
      setShowPassoword(false);
    }

    const googleSuccess=async(res)=>{
         const result= res?.profileObj;
         const token=res?.tokenId;
          
         try {
           dispatch({type:'AUTH',data:{result,token}});
           history.push('/');
         } catch (error) {
           console.log(error);
         }
    }

    const googleFailure=(error)=>{
      console.log(error);
           console.log('Google signin was unsuccessfull.Try again');
    }

    return (
       <Container component="main" maxWidth="xs">
         <Paper className={classes.paper} elevation={3}>
             <Avatar className={classes.avatar}>
                   <LockOutlinedIcon />
             </Avatar>
             <Typography variant="h5">{isSignup?'SignUp':'Sign In'}</Typography>
             <form className={classes.form} onSubmit={handleSubmit}>
               
               {/* //forSigningUP */}
               <Grid container spacing={2}>
                   {
                       isSignup && (
                           <>
                             <Input name="FirstName" label="First Name" handleChange={handleChange} autoFocus half />
                             <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                           </>
                       )}
                       <Input name="email" label="Email Adress" handleChange={handleChange} type="email" />
                       <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" :"password"} handleShowPassword={handleShowPassword}/>
                      {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
               
               </Grid>
               <Button type="submit" fullwidth variant="contained" color="primary" className={classes.submit}>
                 {isSignup ? 'Sign Up':'Sign IN'}
               </Button>
               <GoogleLogin clientId="105619134379-m6ro1t1957uaemcgu2u55314mu50dupd.apps.googleusercontent.com"
               render={(renderProps)=>(
                 <Button className={classes.googleButton}
                  color="primary" 
                  fullWidth 
                  onClick={renderProps.onClick} 
                  disabled={renderProps.disabled} 
                  startIcon={<Icon />} 
                 variant="contained" >
                   Google Sign In
                 </Button>
               )}
               onSuccess={googleSuccess}
               onFailure={googleFailure}
               cookiePolicy={"single_host_origin"}
               />
             
               <Grid container justify="flex-end">
                   <Grid item>
                     <Button onClick={switchMode}>
                       {isSignup ? 'Already have an account? Sign In': "Don't have an account? Sign Up"}
                     </Button>
                   </Grid>
               </Grid>
             </form>
         </Paper>

       </Container>
    )
}

export default Auth;