import { z } from "zod";

const userSchema ={
    //register user
    registerEmployee: z.object({
      healthStationId: z.number(),
      email: z.string().email(),
      phone: z.string().max(14),
      password: z.string().min(8).max(20),
     //profile
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      sex: z.enum(['MALE', 'FEMALE']),
      imageUrl: z.string(),
      //manager, reception and hp related
      title: z.string(),
      position: z.string()
      
   }),
   //define mother
   registerMother: z.object({
      healthStationId: z.number(),
      email: z.string().email(),
      phone: z.string().max(14),
      password: z.string().min(8).max(20),
     
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      sex: z.enum(['MALE', 'FEMALE']),
      imageUrl: z.string(),
      //mother related
      birthdate: z.string(),
      bloodType:  z.string(),
      RH: z.string(),

      
   }),
   // define
   updateMother: z.object({
      healthStationId: z.number(),
      password: z.string().min(8).max(20),
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      sex: z.enum(['MALE', 'FEMALE']),
      imageUrl: z.string(),
      //mother related
      birthdate: z.string(),
      bloodType:  z.string(),
      RH: z.string(),
   }),
   //update email and phone
   updateEmailAndPhone: z.object({
      healthStationId: z.number(),
      role: z.string(),
      email: z.string().email(),
      phone: z.string().max(14),
      password: z.string().min(8).max(20),}),

       //login schema
   login: z.object({
      email:z.string().email(),
      password:z.string()
      
   })

}

export default userSchema;