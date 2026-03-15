import { json } from "express";
import { redisClient } from "../redis.connection.DB.js";
export const set=async({key,val,ttl}={})=>{
    // console.log({key});
    let data=typeof val==='string'?val:JSON.stringify(val)
return ttl? await redisClient.set(key,data,{EX:ttl}):await redisClient.set(key,data)

}
export const update=async({key,val,ttl}={})=>{

    if(!await redisClient.exists(key)
    )return 0
return await set({key,val,ttl})

}
export const inc=async(key)=>{

    if(!await redisClient.exists(key) )return 0
return redisClient.incr(key)

}
export const get1=async(key)=>{
    let data=await redisClient.get(key)
    try{
        return JSON.parse(data)
    }
    catch{
        return data
    }
}
export const TTL=async(key)=>{
    console.log({key});
    let data=await redisClient.ttl(key)
  
        return(data)
 
}
export const exists=async({key}={})=>{
    console.log({key});
    let data=await redisClient.exists(key)
  
        return(data)
 
}
export const expire=async({key,ttl}={})=>{
    console.log({key});
    let data=await redisClient.expire(key,ttl)
  
        return(data)
 
}
export const mGet=async(keys=[])=>{
    console.log({keys});
    let data=await redisClient.mGet(keys)
  
        return(data)
 
}
export const keys=async(prefix)=>{
    let data=await redisClient.keys(`${prefix}*`)
  
        return(data)
 
}
export const delete1=async(key)=>{
    let data=await redisClient.del(key)
  
        return(data)
 
}