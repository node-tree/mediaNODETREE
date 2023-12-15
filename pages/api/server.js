import {connectDB} from "@/util/database";

export default async function handler(req, res) {
    console.log('handler');
    if(req.method === 'POST'){
    let db = (await connectDB).db('mediaUnit');
    let result = db.collection('poem').insertOne(req.body);
    // res.status(200).json();
    res.redirect('/');
    }
    
    
}