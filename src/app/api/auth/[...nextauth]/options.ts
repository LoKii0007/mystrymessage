import dbConnect from "@/lib/db.connect";
import UserModel from "@/model/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'

export const authOptions : NextAuthOptions = {
   providers :[
      CredentialsProvider({
         id : 'credentials',
         name :' Credentials',
         credentials: {
            email: { label: "Username", type: "text", placeholder: "someone@gmail.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials : any) : Promise<any> {
            //isme user return karna padega ya phir error batana padega 
            await dbConnect()
            console.log('credentials :', credentials)
            try {
               const user = await UserModel.findOne({
                  $or:[
                     {email : credentials.identifier},
                     {username : credentials.identifier}
                  ]
               })
               if(!user){
                  throw new Error('no user found with this email')
               }
               if(!user.isVerified){
                  throw new Error('please verify your account before login')
               }
               console.log('user :' , user)
               const isPassCorrect = await bcrypt.compare(credentials.password, user.password)
               if(isPassCorrect){
                  return user
               }else{
                  throw new Error('incorrect email or password')
               }
            } catch (error:any) {
               throw new Error(error)
            }
          }
      })
   ],
   callbacks :{
      // jo user authorize me return kia hai vo isme store ho gaya hai
      async jwt({token, user}){
         // types me jake user ki field ko update krna padega ye next auth ke hosab se default user manta hai
         // user is defined like interface
         // type/next-auth.d.ts
         if(user){
            //token me aur fields add karenge
            token._id = user._id
            token.isVerified = user.isVerified
            token.isScceptinMessages = user.isAcceptingMessages
            token.username = user.username
         }
         return token
      },
      async session({session, token}){
         // same session interface ko bhi update karna padega
         if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
         }
         return session
      }
   },
   pages :{
      //jo bhi signin signup pages hai unhe apne route se redirect karne ke liye
      signIn : '/sign-in'
   },
   session:{
      strategy : 'jwt'
   },
   secret: process.env.NEXTAUTH_SECRET
}