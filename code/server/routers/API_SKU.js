const express = require('express');
const app = express.Router();

const skuDAO = require('../DB/skuDAO.js')
const positionDAO = require('../DB/positionDAO.js')

const db = require('../DB/db.js')
const sku_dao = new skuDAO(db);
const position_dao = new positionDAO(db);
//const Session = require('../session')
//const session = new Session;

///---------------------------------------------------------------------------------------------------------------------///
///---------------------------------------------------------SKU---------------------------------------------------------///
app.get('/api/skus', async (req, res) =>{
    try{
      const result = await sku_dao.getAllSKU();
      for (const d of result){
        d.testDescriptors = await sku_dao.getTestDescriptors(d.id).map(a=>parseInt(a.name.split(" ")[2]));
        d.position = d.position || "";
      }
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
      return;
    }
  
  })
  
  app.get('/api/skus/:id', async (req, res) =>{
    try{
      //console.log(req.params.id);
      if(isNaN(req.params.id) || req.params.id < 0){
        return res.status(422).end();
        return;
      }
      const result = await sku_dao.getSKU(req.params.id);
      if(result.length == 0){
        return res.status(404).json({message:"Not found"}).end();
        return;
      }
      else{
        for (const d of result){
          d.testDescriptors = await sku_dao.getTestDescriptors(d.id).map(a=>a.TESTDESCRIPTOR);
          d.position = d.position || "";
        }
        return res.status(200).json(result[0]).end();
      }
      
    }
    catch(err){
      return res.status(500).end();
      return;
    }
    
  })
  
  
  app.post('/api/sku', async (req, res) =>{
    try{
      const sku = {
        description: req.body.description,
        weight: req.body.weight,
        volume: req.body.volume,
        notes: req.body.notes,
        price: req.body.price,
        availableQuantity: req.body.availableQuantity
      }
      if(
        !sku.description ||
        !sku.weight ||
        !sku.volume ||
        !sku.notes ||
        !sku.price ||
        !sku.availableQuantity ||
        sku.description == "" ||
        sku.notes == "" ||
        isNaN(sku.weight) || sku.weight <= 0 ||
        isNaN(sku.volume) || sku.volume <= 0 ||
        isNaN(sku.price) || sku.price <= 0 ||
        !Number.isInteger(Number(sku.weight)) ||
        !Number.isInteger(Number(sku.volume)) ||
        !Number.isInteger(Number(sku.availableQuantity)) ||
        isNaN(sku.availableQuantity)  || sku.availableQuantity < 0)
        {
          return res.status(422).end();
        }
      
      await sku_dao.createSKU(sku);
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  app.put('/api/sku/:id', async (req, res) =>{
    try{
      const skuID = req.params.id;
      const skus = await sku_dao.getAllSKU();
      const skuExists = skus.filter((a)=>a.id == skuID);
      
      
      if (
          req.params.id == undefined || 
          isNaN(req.params.id) || (
            req.body.newDescription == undefined &&
            req.body.newWeight == undefined &&
            req.body.newVolume == undefined &&
            req.body.newNotes == undefined &&
            req.body.newPrice == undefined &&
            req.body.newPrice == undefined &&
            req.body.newAvailableQuantity == undefined
          )
         ){
        return res.status(422).end();
      }
      const sku = {
        description: req.body.newDescription == undefined? skuExists[0].description : req.body.newDescription,
        weight: req.body.newWeight == undefined? skuExists[0].weight : req.body.newWeight,
        volume: req.body.newVolume == undefined? skuExists[0].volume : req.body.newVolume,
        notes: req.body.newNotes == undefined?  skuExists[0].notes : req.body.newNotes,
        price: req.body.newPrice == undefined? skuExists[0].price : req.body.newPrice,
        availableQuantity: req.body.newAvailableQuantity == undefined? skuExists[0].availableQuantity : req.body.newAvailableQuantity
      }

      if(
        sku.description == "" ||
        sku.notes == "" ||
        isNaN(sku.weight) || sku.weight <= 0 ||
        isNaN(sku.volume) || sku.volume <= 0 ||
        isNaN(sku.price) || sku.price <= 0 ||
        !Number.isInteger(Number(sku.weight)) ||
        !Number.isInteger(Number(sku.volume)) ||
        !Number.isInteger(Number(sku.availableQuantity)) ||
        isNaN(sku.availableQuantity)  || sku.availableQuantity < 0
      ){
        return res.status(422).end();
      }

      if(skuExists.length == 0){
        return res.status(404).end();
      }

      const pos = await position_dao.getAllPositions().filter((a)=>a.positionID==skuExists[0].position);
      
      
      /*if (
        skuExists[0].position == null || pos.length == 0){
        return res.status(422).end();
      }*/
      
  
      const neededWeight = sku.weight * sku.availableQuantity;
      const neededVolume = sku.volume * sku.availableQuantity;
      /*if(pos[0].maxVolume < neededVolume || pos[0].maxWeight < neededWeight){
        return res.status(422).end();
      }*/
      await sku_dao.updateSKU(skuID, sku, skuExists[0].position);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  app.put('/api/sku/:id/position', async (req, res) =>{
    try{
      const positionID = req.body.position;
      const skuID = req.params.id;
      if(positionID.length !== 12){
        return res.status(422).json({message:"Unprocessable entity"}).end();
        return;
      }
  
      const positionExists = await position_dao.getAllPositions()/*.map(a=>a.positionID)*/.filter((a)=>a.positionID == positionID);
      const skus = await sku_dao.getAllSKU();
      const skuExists = skus.filter((a)=>a.id == skuID);
      if(positionExists.length == 0 || skuExists.length == 0){
        return res.status(404).end();
      }
  
      const positionAssigned = skus.filter((a)=>a.position == positionID);
      if(positionAssigned.length !== 0){
        return res.status(422).end();
      }
      const neededWeight = skuExists[0].weight * skuExists[0].availableQuantity;
      const neededVolume = skuExists[0].volume * skuExists[0].availableQuantity;
      if(positionExists[0].maxVolume < neededVolume || positionExists[0].maxWeight < neededWeight){
        return res.status(422).end();
      }
  
      await sku_dao.setPosition(skuID, positionID, neededWeight, neededVolume);
      await position_dao.updateOccupiedPosition(positionID, {occupiedVolume:neededVolume, occupiedWeight:neededWeight})
  
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  app.delete('/api/skus/:id', async (req, res) =>{
    try{
      if(isNaN(req.params.id) || req.params.id < 0){
        return res.status(422).end();
        return;
      }
      const sku = req.params.id;
      await sku_dao.deleteSKU(sku);
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })


  module.exports = app;