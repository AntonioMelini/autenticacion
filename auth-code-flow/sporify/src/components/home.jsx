
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home (){
    const [ pedido,setPedido ]= useState(null);



    async function handleCliclk(){
      //  e.preventDefault();

         const Cookies = document.cookie;
    
         let cookiesSpliteadas = Cookies.split(";")
         cookiesSpliteadas= cookiesSpliteadas.map((cook)=>cook.trim())
      
          let token= cookiesSpliteadas.filter((toke)=> toke.startsWith('_a'))
         
          token= token[0].split("=")[1]
          let type = cookiesSpliteadas.filter((toke)=>toke.startsWith('_t'))
         
          type= type[0].split("=")[1]
          console.log("este es el token seleccionado",token,type);

        let request = await axios.get(`http://localhost:3009/api/miscosas/${token}/${type}`)
        console.log("la request :",request.data);
        setPedido(request.data)
    }


    return(
        // <>
        // <div> 

            



        //     <h1>"este es el home"</h1>
        //     <h2>"estos son los tokens</h2>
            
        //     <button onClick={(e)=>handleCliclk(e)}>Mis cosas</button>
        //     {/* <a href={`http://localhost:3009/api/miscosas/${token}/${type}`}>ver mis cosas</a> */}
            
        // </div>
        // </>


        <div>
            { !pedido ? 
            <div>
                 <h1>"este es el home"</h1>
                 <button  onClick={(e)=>handleCliclk(e)}>Mis cosas</button>
                 <br />
                 <br />
                 <a href="/" color="black" >volver al principio</a>
            </div> :
                <div>
                    <h1>Estos son los resultados:</h1>
                    <br/>
                    <p>{pedido}</p>
                    <button onClick={()=>setPedido(null)} >Go Home</button>
                </div> }
        </div>
        
    )
}