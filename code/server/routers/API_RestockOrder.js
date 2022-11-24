const express = require('express');
const app = express.Router();

const restockOrderDAO = require('../DB/restockOrderDAO.js')
const testResultDAO = require('../DB/testResultDAO.js')
const db = require('../DB/db.js');
const skuDAO = require('../DB/skuDAO.js');
const restockOrder_dao = new restockOrderDAO(db);
const testResult_dao = new testResultDAO(db);
const sku_dao = new skuDAO(db);
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

///---------------------------------------------------------------------------------------------------------------------///
///---------------------------------------------------------Restock order---------------------------------------------------------///
  app.get('/api/restockOrders', async (req, res) =>{
    try{
      const allOrders = await restockOrder_dao.getAllRestockOrders();
      for (const order of allOrders){
        let m = await restockOrder_dao.getProducts(order.id)
        order.skuItems = [];
        order.products=[];
        for (const pr of m){
          let id = await restockOrder_dao.getItemID(pr.productId, allOrders.supplierId);
          
          order.products.push({SKUId:pr.productId, itemId:id, description:pr.description, price:pr.price, qty:pr.quantity});
        }
        
        if(order.state !== "ISSUED"){
          order.transportNote = await restockOrder_dao.getTransportNote(order.id);
        }
        
        if(order.state !== "ISSUED" && order.state !== "DELIVERY"){
          
          let items = await restockOrder_dao.getSkuItems(order.id);
          for (const i of items){
            let itemId = await restockOrder_dao.getItemID(i.productId, order.supplierId);
            order.skuItems.push({SKUId:i.productId, itemId:itemId, rfid:i.rfid});
          }
        }
        
      }
      return res.status(200).json(allOrders).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/restockOrdersIssued', async (req, res) =>{
    try{
      const result = await restockOrder_dao.getRestockOrdersState("ISSUED");
      for (const order of result){
        let products = await restockOrder_dao.getProducts(order.id)
        order.skuItems = [];
        order.products=[];
        for (const pr of products){
          let itemId = await restockOrder_dao.getItemID(pr.productId, order.supplierId)
          order.products.push({SKUId:pr.productId, itemId:itemId, description:pr.description, price:pr.price, qty:pr.quantity});
        }
      }
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/restockOrders/:id', async (req, res) =>{
    try{
      const id = req.params.id;
      if(id === undefined || isNaN(id)){
        return res.status(422).end();
      }
      const preResult = await restockOrder_dao.getRestockOrder(id);
      if (preResult.length === 0){
        return res.status(404).end();
      }
      const result = preResult[0];
      let m = await restockOrder_dao.getProducts(result.id)
      result.skuItems = [];
      result.products=[];
      for (const pr of m){
        let itemId = await restockOrder_dao.getItemID(pr.productId, order.supplierId)
        result.products.push({SKUId:pr.productId, itemId:itemId, description:pr.description, price:pr.price, qty:pr.quantity});
      }
      if(result.state !== "ISSUED"){
        result.transportNote = await restockOrder_dao.getTransportNote(result.id);
      }
      
      if(result.state !== "ISSUED" && result.state !== "DELIVERY"){
        
        let items = await restockOrder_dao.getSkuItems(result.id);
        
        for (const i of items){
          let itemId = await restockOrder_dao.getItemID(i.SKUId, result.supplierId)
          result.skuItems.push({SKUId:i.SKUId, itemId:itemId, rfid:i.rfid});
        }
      }
      
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/restockOrders/:id/returnItems', async (req, res) =>{
    try{
      const id = req.params.id;
      if(id === undefined || isNaN(id)){
        return res.status(422).end();
      }
      const preResult = await restockOrder_dao.getRestockOrder(id);
      if (preResult.length === 0){
        return res.status(404).end();
      }
      const result = preResult[0];
      if(result.state !== "COMPLETEDRETURN"){
        return res.status(422).end();
      }
      result.skuItems = [];
  
      let items = await restockOrder_dao.getSkuItems(result.id);
      for (const i of items){
        const tRes = await testResult_dao.getTestResults(i.rfid);
        const tResFail = tRes.filter(a=>a.Result === "false");
        
        if (tResFail.length > 0) {
          let itemId = await restockOrder_dao.getItemID(i.productId, result.supplierId);
          result.skuItems.push({SKUId: i.productId, itemId: itemId, rfid: i.rfid});
        }
      }
  
      return res.status(200).json(result.skuItems).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.post('/api/restockOrder', async (req, res) =>{
    try{
      const restockOrder = {
        issueDate:req.body.issueDate,
        supplierId:req.body.supplierId,
        products:req.body.products,
        state:"ISSUED",
        skuItems:[]
      }
  
      if(restockOrder.issueDate === undefined
        || restockOrder.supplierId === undefined
        ||
          (
            !dayjs(restockOrder.issueDate, 'YYYY/MM/DD', false).isValid() &&
            !dayjs(restockOrder.issueDate, 'YYYY/MM/DD HH:mm', false).isValid()
          )){
          return res.status(422).end();
        }
  
      const skus = await sku_dao.getAllSKU().map(a=>a.id);
      for (const p of restockOrder.products){
        if(!skus.includes(p.SKUId) || !skus.includes(p.itemId)){
          return res.status(422).end();
        }
      }
      await restockOrder_dao.insertRestockOrder(restockOrder);
  
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  app.put('/api/restockOrder/:id', async (req, res) =>{
    try{
      if (!req.body){
        return res.status(422).end();
      }
      const restockOrder = {
        state:req.body.newState
      }
      if (restockOrder.state === undefined || req.params.id === undefined || isNaN(req.params.id)){
        return res.status(422).end();
      }
  
      let ord = await restockOrder_dao.getAllRestockOrders();
      ord = ord.filter(a=>Number(a.id) === Number(req.params.id));
      
      
      if(ord.length === 0){
        return res.status(404).end();
      }
      await restockOrder_dao.modifyRestockOrderState(req.params.id, restockOrder);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  
  app.put('/api/restockOrder/:id/:supplierId/skuItems', async (req, res) =>{
    try{
      
      if (!req.body){
        return res.status(422).end();
      }
      const restockOrder = {
        skuItems:req.body.skuItems
      }
      if (req.params.id === undefined || isNaN(req.params.id) || !restockOrder.skuItems || restockOrder.skuItems.length === 0
          || req.params.supplierId === undefined || isNaN(req.params.supplierId)){
        return res.status(422).end();
      }
      let Allorders = await restockOrder_dao.getAllRestockOrders();
      
      order = Allorders.filter(a=>
        (Number(a.id) === Number(req.params.id))&
        (Number(a.supplierId) === Number(req.params.supplierId))
        );  

        //console.log(Allorders);
      if(order.length === 0){
        return res.status(404).end();
      }
      order = order[0];
      
      if(order.state !== "DELIVERED"){
        return res.status(422).end();
      }
  
      await restockOrder_dao.modifyRestockOrderProducts(req.params.id,req.params.supplierId, restockOrder);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  
  app.put('/api/restockOrder/:id/transportNote', async (req, res) =>{
    try{
      const restockOrder = {
        transportNote:req.body.transportNote
      }
      if (req.params.id === undefined || isNaN(req.params.id) || restockOrder.transportNote.length === 0){
        return res.status(422).end();
      }
  
      let ord = await restockOrder_dao.getAllRestockOrders();
      ord = ord.filter(a=>Number(a.id) === Number(req.params.id));
      
      if(ord.length === 0){
        return res.status(404).end();
      }
      ord = ord[0];
      if(ord.state !== "DELIVERY"){
        return res.status(422).end();
      }
  
      await restockOrder_dao.modifyRestockOrderTransportNote(req.params.id, restockOrder);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  app.delete('/api/restockOrder/:id', async (req, res) =>{
    try{
      if(req.params.id === undefined || isNaN(req.params.id)){
        return res.status(422).end();
      }
      await restockOrder_dao.deleteRestockOrder(req.params.id)
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })


  






module.exports = app;