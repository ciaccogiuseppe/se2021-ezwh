const express = require('express');
const app = express.Router();
const skuDAO = require('../DB/skuDAO.js')

const testDescriptorDAO = require('../DB/testDescriptorDAO.js')
const db = require('../DB/db.js')
const testDescriptor_dao = new testDescriptorDAO(db);
const sku_dao = new skuDAO(db);

 ///---------------------------------------------------------------------------------------------------------------------///
  ///---------------------------------------------------------Test Descriptor---------------------------------------------------------///
  
  app.get('/api/testDescriptors', async (req, res) =>{
    try{
      const result = await testDescriptor_dao.getAllTestDescriptors();
      
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/testDescriptors/:id', async (req, res) =>{
    try{
      //console.log(req.params.id);
      if(isNaN(req.params.id) || req.params.id < 0){
        return res.status(422).json({message:"Unprocessable entity"}).end();
      }
      const result = await testDescriptor_dao.getTestDescriptorById(req.params.id);
      //console.log(req.params.id);
      
      if(result.length == 0){
        return res.status(404).json({message:"Not found"}).end();
      }
      else{
       
        return res.status(200).json(result[0]).end();
      }
      
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.post('/api/testDescriptor', async (req, res) =>{
    try{
      
      const testDescriptor = {
        name: req.body.name,
        procedureDescription: req.body.procedureDescription,
        idSKU: req.body.idSKU,
      }
      
      if(
        testDescriptor.name == undefined || testDescriptor.name == "" ||
        testDescriptor.procedureDescription == undefined || testDescriptor.procedureDescription == "" ||
        testDescriptor.idSKU == undefined || isNaN(testDescriptor.idSKU)
  
        )
        {
          return res.status(422).end();
        }
  
      const skus = await sku_dao.getAllSKU();
      const skuExists = skus.filter((a)=>a.id == testDescriptor.idSKU);
      if(skuExists.length == 0){
        return res.status(404).end();
      }
      
      await testDescriptor_dao.createTestDescriptor(testDescriptor);
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  app.put('/api/testDescriptor/:id', async (req, res) =>{
    try{    
  
      if(req.body == undefined || req.body == null){
        return res.status(422).end();
      }

      const testDescriptorID = req.params.id;
      const testDescriptors = await testDescriptor_dao.getAllTestDescriptors();
      const testDescriptorExists = testDescriptors.filter((a)=>a.id == testDescriptorID);


      if (
        (
        req.body.newName == undefined &&
        req.body.newProcedureDescription == undefined &&
        req.body.newIdSKU == undefined
      ) ||
      req.params.id == undefined ||
      isNaN(req.params.id) ||
      isNaN(req.body.newIdSKU)){
        return res.status(422).end();
      }

      const testDescriptor = {
        newName: req.body.newName || testDescriptorExists[0].name,
        newProcedureDescription: req.body.newProcedureDescription || testDescriptorExists[0].procedureDescription,
        newIdSKU: req.body.newIdSKU || testDescriptorExists[0].idSKU,
      }


      //console.log(req.params.id);
      
      
      
      
      // console.log(skuItemExists);
  
      if(testDescriptorExists.length == 0){
        return res.status(404).end();
      }
  
      const skus = await sku_dao.getAllSKU();
      const skuExists = skus.filter((a)=>a.id == testDescriptor.newIdSKU);
      if(skuExists.length == 0){
        return res.status(404).end();
      }
  //  console.log(testDescriptorExists[0]);
      await testDescriptor_dao.modifyTestDescriptor(testDescriptorID, testDescriptor);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  app.delete('/api/testDescriptor/:id', async (req, res) =>{
    if(isNaN(req.params.id) || req.params.id < 0){
      return res.status(422).json({message:"Unprocessable entity"}).end();
    }
    try{
      const id = req.params.id;
      await testDescriptor_dao.deleteTestDescriptor(id);
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })

  module.exports = app;