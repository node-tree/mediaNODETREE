import { connectDB } from '/util/database';

export default async function Poem(){
    
    const db = (await connectDB).db('mediaUnit');
    let result = await db.collection('poem').find().toArray();

    return(
        <div style={{ whiteSpace: 'normal', overflow: 'auto' }}>
            {
                result.map((a,i)=>  
                    <span key={i}> {result[i].title}</span>
                )
            }
        </div>
    )
}