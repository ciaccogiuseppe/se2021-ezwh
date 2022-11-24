const express = require('express');
const app = express.Router();

const returnOrderDAO = require('../DB/returnOrderDAO.js')
const restockOrderDAO = require('../DB/restockOrderDAO.js')
const db = require('../DB/db.js')
const returnOrder_dao = new returnOrderDAO(db);


const restockOrder_dao = new restockOrderDAO(db);
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


///---------------------------------------------------------------------------------------------------------------------///
  ///---------------------------------------------------------ReturnOrder---------------------------------------------------------///
  
  app.get('/api/returnOrders', async (req, res) =>{
    try{
      const allOrders = await returnOrder_dao.getAllRO();
      for (const order of allOrders){
        order.products=[];
        let m = await returnOrder_dao.getProducts(order.id);
        const supplierId = await returnOrder_dao.getSupplierIdByRestockOrder(order.restockOrderId);
        for (const pr of m){
          let id = await returnOrder_dao.getItemID(pr.productId, supplierId);          
          order.products.push({SKUId:pr.productId, itemId:id, description:pr.description, price:pr.price, RFID:pr.RFID});        
        }
      }
     
      return res.status(200).json(allOrders).end();
    }
    catch(err){
      console.log(String(err));
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/returnOrders/:id', async (req, res) =>{
    try{
      //console.log(req.params.id);
      if(isNaN(req.params.id) || req.params.id < 0){
        return res.status(422).json({message:"Unprocessable entity"}).end();
      }
      const result = await returnOrder_dao.getRO(req.params.id);
      for (const d of result){
        d.products=[];
        let m = await returnOrder_dao.getProducts(d.id);
        const supplierId = await returnOrder_dao.getSupplierIdByRestockOrder(d.restockOrderId);
        for (const pr of m){
          let id = await returnOrder_dao.getItemID(pr.productId, supplierId); 
          d.products.push({SKUId:pr.productId, itemId:id, description:pr.description, price:pr.price, RFID:pr.RFID});        
        }
      }
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
  
  
  app.post('/api/returnOrder', async (req, res) =>{
    try{
      const RO = {
        returnDate: req.body.returnDate,
        restockOrderId: req.body.restockOrderId,
        products: req.body.products,
        supplierId: req.body.supplierId
        
      }
      
      if(
        RO.products == undefined || RO.products == ""  ||
        RO.returnDate == undefined || RO.returnDate == "" ||
        (
          !dayjs(RO.returnDate, 'YYYY/MM/DD', true).isValid() &&
          !dayjs(RO.returnDate, 'YYYY/MM/DD HH:mm', false).isValid()
        ) ||
        isNaN(RO.restockOrderId) || RO.restockOrderId < 0
        || isNaN(RO.supplierId) || RO.supplierId < 0)
        {
          return res.status(422).end();
        }
        const restockOrderExists = await restockOrder_dao.getRestockOrder(RO.restockOrderId);

        if (restockOrderExists.length == 0){
            return res.status(404).end();
          }
      
        await returnOrder_dao.createReturnOrder(RO);
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  
  app.delete('/api/returnOrder/:id', async (req, res) =>{
    if(isNaN(req.params.id) || req.params.id < 0){
      return res.status(422).json({message:"Unprocessable entity"}).end();
      return;
    }
    try{
      const id = req.params.id;
      await returnOrder_dao.deleteRO(id);
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })

module.exports = app;