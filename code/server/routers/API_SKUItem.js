const express = require('express');
const app = express.Router();

const skuitemDAO = require('../DB/skuItemDAO.js')
const skuDAO = require('../DB/skuDAO.js')
const db = require('../DB/db.js')
const skuitem_dao = new skuitemDAO(db);
const sku_dao = new skuDAO(db);
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
///---------------------------------------------------------------------------------------------------------------------///
  ///---------------------------------------------------------SKUItem---------------------------------------------------------///
  
  app.get('/api/skuitems', async (req, res) =>{
    try{
      const result = await skuitem_dao.getAllSKUItems();
      
      return res.status(200).json(result);
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/skuitems/sku/:id', async (req, res) =>{
    try{
      //console.log(req.params.id);
      if(isNaN(req.params.id) || req.params.id < 0){
        return res.status(422).json({message:"Unprocessable entity"}).end();
        return;
      }
      const result = await skuitem_dao.getSKUItemsById(req.params.id);
      
      if(result.length == 0){
        return res.status(404).json({message:"Not found"}).end();
      }
      else{
       
        return res.status(200).json(result).end();
      }
      
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/skuitems/:rfid', async (req, res) =>{
    try{
      if(req.params.rfid.length !== 32){
        return res.status(422).json({message:"Unprocessable entity"}).end();
        return;
      }
      const result = await skuitem_dao.getSKUItemByRFID(req.params.rfid);
      //console.log(result.length);
      
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
  
  app.post('/api/skuitem', async (req, res) =>{
    try{
      
      const skuitem = {
        RFID: req.body.RFID,
        SKUId: req.body.SKUId,
        DateOfStock: req.body.DateOfStock,
        
      }
      if(
        skuitem.SKUId == undefined || isNaN(skuitem.SKUId) ||
        skuitem.RFID == undefined || skuitem.RFID == ""  || skuitem.RFID.length !== 32 ||
        skuitem.DateOfStock == undefined || skuitem.DateOfStock == "" )
        {
          return res.status(422).end();
        }
        const result = await sku_dao.getSKU(skuitem.SKUId);
        if ( result.length == 0){
          return res.status(404).end();
        }
        await skuitem_dao.createSKUItem(skuitem);
        return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  app.put('/api/skuitems/:rfid', async (req, res) =>{
    try{
  
      if(
        (
          req.body.newRFID == undefined &&
          req.body.newAvailable == undefined &&
          req.body.newDateOfStock == undefined
        ) ||
        req.body.newRFID == null ||
        req.body.newAvailable == null ||
        req.body.newDateOfStock == null /*||
        skuItem.newRFID.length !== 32 ||
        isNaN(skuItem.newAvailable) ||
        skuItem.newAvailable < 0 ||
        (
          !dayjs(skuItem.newDateOfStock, 'YYYY/MM/DD', true).isValid() &&
          !dayjs(skuItem.newDateOfStock, 'YYYY/MM/DD HH:mm', true).isValid()
        )*/
        )
        {
          return res.status(422).end();
          
        }

        const skuItemRFID = req.params.rfid;
        const skuItems = await skuitem_dao.getAllSKUItems();
        const skuItemExists = skuItems.filter((a)=>a.RFID == String(skuItemRFID));
        
    
    
        const skuItem = {
          newRFID: req.body.newRFID == undefined? skuItemExists[0].RFID : req.body.newRFID,
          newAvailable: req.body.newAvailable == undefined? skuItemExists[0].Available : req.body.newAvailable,
          newDateOfStock: req.body.newDateOfStock == undefined? skuItemExists[0].DateOfStock : req.body.newDateOfStock,
        }
        if(
          skuItem.newRFID == undefined || skuItem.newRFID == ""  || skuItem.newRFID.length !== 32 ||
          isNaN(skuItem.newAvailable) || skuItem.newAvailable < 0 ||
          skuItem.newDateOfStock == ""
        ){
          return res.status(422).end();
        }

        if(skuItemExists.length == 0){
          return res.status(404).end();
        }
        
      await skuitem_dao.updateSKUItem(skuItemRFID, skuItem);
      
      return res.status(200).end();
    }
    catch(err){
      return  res.status(503).end();
    }
    
  })
  
  app.delete('/api/skuitems/:rfid', async (req, res) =>{
    if(req.params.rfid.length !== 32){
      return res.status(422).json({message:"Unprocessable entity"}).end();
    }
    try{
      const rfid = req.params.rfid;
      await skuitem_dao.deleteSKUItem(rfid);
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })


module.exports = app;