const express = require('express');
const app = express.Router();

const usersTable = require('../DB/userDAO.js')
const db = require('../DB/db.js')
const user_dao = new usersTable(db);
const common = require('./common.js')

  ///---------------------------------------------------------------------------------------------------------------------///
  ///---------------------------------------------------------Users---------------------------------------------------------///

  app.get("/api/userinfo", async (req, res) => {
    try {
      const isUserLoggedIn = true; // fixed since sessions are not implemented yet
      const id = 3; // fixed since sessions are not implemented yet
      //console.log(req);
      if (isUserLoggedIn) {
        const result = await user_dao.getUserInfo(id);
        return res.status(200).json(result[0]).end();
      }
      else {
        return res.status(401).json({message:"Unauthorized"}).end();
      }
    }
    catch(err) {
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  app.get('/api/suppliers', async (req, res) =>{
    try{
      const result = await user_dao.getSuppliers();
      return res.status(200).json(result).end();
  
    }
    catch(err){
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  app.get('/api/users', async (req, res) =>{
    try{
      const result = await user_dao.getAllUsers();
      return res.status(200).json(result).end();
  
    }
    catch(err){
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  
  
  app.post('/api/newUser', async (req, res) => {
    //Must be an administrator, to add after sessions are implemented
    try {
      const user = {
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password,
        type: req.body.type
      }
      const userTypes = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];
      const result = await user_dao.getUserByUsernameAndType(user.username, user.type);
      if (result.length === 0)
      {
        const isValidUsername = common.validateEmail(user.username);
        //console.log(isValidUsername);
        if (
            !isValidUsername || user.username === undefined || user.username === "" ||
            user.name === undefined || user.name === "" ||
            user.surname === undefined || user.surname === "" ||
            user.password === undefined || user.password.length < 8 ||
            user.type === undefined || !userTypes.includes(user.type))
        {
          return res.status(422).json({message:"Unprocessable Entity"}).end();
        }
        else
        {
          await user_dao.createUser(user);
          return res.status(201).json({message:"Created"}).end();
        }
      }
      else // Conflict (user with same mail and type already exists)
      {
        return res.status(409).json({message:"Conflict"}).end();
      }
    } catch (err) {
      return res.status(503).json({message:"Service Unavailable"}).end();
    }
  })
  
  
  app.post(["/api/managerSessions"],async (req,res)=>{
    try{
      const result = await user_dao.login('manager', req.body.username, req.body.password);

      if (result===undefined || result.length === 0) {
        return res.status(401).json({message:"Unauthorized"}).end();
      }
      else {
        return res.status(200).json(result).end();
      }
    }
    catch(err){
      //console.log(err);
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  app.post(["/api/customerSessions"],async (req,res)=>{
    try{
      const result = await user_dao.login('customer', req.body.username, req.body.password);
  
      if (result===undefined || result.length === 0) {
        return res.status(401).json({message:"Unauthorized"}).end();
      }
      else {
        return res.status(200).json(result).end();
      }
    }
    catch(err){
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  app.post(["/api/supplierSessions"],async (req,res)=>{
    try{
      const result = await user_dao.login('supplier', req.body.username, req.body.password);
  
      if (result===undefined || result.length === 0) {
        return res.status(401).json({message:"Unauthorized"}).end();
      }
      else {
        return res.status(200).json(result).end();
      }
    }
    catch(err){
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  app.post(["/api/clerkSessions"],async (req,res)=>{
    try{
      const result = await user_dao.login('clerk', req.body.username, req.body.password);
  
      if (result===undefined || result.length === 0) {
        return res.status(401).json({message:"Unauthorized"}).end();
      }
      else {
        return res.status(200).json(result).end();
      }
    }
    catch(err){
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  app.post(["/api/qualityEmployeeSessions"],async (req,res)=>{
    try{
      const result = await user_dao.login('qualityEmployee', req.body.username, req.body.password);
  
      if (result===undefined || result.length === 0) {
        return res.status(401).json({message:"Unauthorized"}).end();
      }
      else {
        return res.status(200).json(result).end();
      }
    }
    catch(err){
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  app.post(["/api/deliveryEmployeeSessions"],async (req,res)=>{
    try{
      const result = await user_dao.login('deliveryEmployee', req.body.username, req.body.password);
  
      if (result===undefined || result.length === 0) {
        return res.status(401).json({message:"Unauthorized"}).end();
      }
      else {
        return res.status(200).json(result).end();
      }
    }
    catch(err){
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  
  app.post("/api/logout",(req,res)=>{
    const logoutSuccessful = true; // hardcoded since sessions not implemented yet
  
    if (logoutSuccessful) {
      return res.status(200).json({message:"Ok"}).end();
    }
    else {
      return res.status(500).json({message:"Internal Server Error"}).end();
    }
  })
  
  
  app.put("/api/users/:username",async (req,res)=>{
    const isManager = true;  // hardcoded since sessions not implemented yet
  
    if (!isManager) {
      return res.status(401).json({message:"Unauthorized"}).end();
    }
    else {
      const isValidUsername = common.validateEmail(req.params.username);
      if (!isValidUsername || req.body.oldType === undefined || req.body.oldType === "" || req.body.oldType === "manager" ||
          (req.body.oldType !== "customer" && req.body.oldType !== "qualityEmployee" && req.body.oldType !== "clerk" &&
              req.body.oldType !== "deliveryEmployee" && req.body.oldType !== "supplier") ||
          req.body.newType === undefined || req.body.newType === "" || req.body.newType === "manager" ||
          (req.body.newType !== "customer" && req.body.newType !== "qualityEmployee" && req.body.newType !== "clerk" &&
              req.body.newType !== "deliveryEmployee" && req.body.newType !== "supplier")) {
  
                return res.status(422).json({message:"Unprocessable Entity"}).end();
  
      }
      else {
        try {
          const result = await user_dao.getUserByUsernameAndType(req.params.username, req.body.oldType);
          if (result.length === 0) {
            return res.status(404).json({message:"Not found"}).end();
          }
          else {
            await user_dao.updateUserRights(req.params.username, req.body.oldType, req.body.newType);
            return res.status(200).json({message:"Ok"}).end();
          }
        }
        catch (err) {
          return res.status(503).json({message:"Service Unavailable"}).end();
        }
      }
    }
  })
  
  app.delete("/api/users/:username/:type",async (req,res)=>{
    const isManager = true;  // hardcoded since sessions not implemented yet
  
    if (!isManager) {
      return res.status(401).json({message:"Unauthorized"}).end();
    }
    else {
      const isValidUsername = common.validateEmail(req.params.username)
      if (!isValidUsername || req.params.type === undefined || req.params.type === "" || req.params.type === "manager" ||
          (req.params.type !== "customer" && req.params.type !== "qualityEmployee" && req.params.type !== "clerk" &&
              req.params.type !== "deliveryEmployee" && req.params.type !== "supplier")) {
  
                return res.status(422).json({message:"Unprocessable Entity"}).end();
      }
      else {
        try {
          await user_dao.deleteUser(req.params.username, req.params.type)===undefined;
          return res.status(204).json({message:"No Content"}).end();
        }catch (err) {
          return res.status(503).json({message:"Service Unavailable"}).end();
        }
      }
    }
  })
  

module.exports = app;