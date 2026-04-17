const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let emergencies = []

app.post("/emergency",(req,res)=>{

emergencies.push(req.body)

res.json({message:"Emergency received"})

})

app.get("/emergencies",(req,res)=>{

res.json(emergencies)

})

app.listen(5000,()=>{
console.log("Server running on port 5000")
})