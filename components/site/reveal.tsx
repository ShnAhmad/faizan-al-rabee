'use client';
import {motion,useReducedMotion} from 'motion/react';
export function Reveal({children,className='',delay=0}:{children:React.ReactNode;className?:string;delay?:number}){const reduce=useReducedMotion();return <motion.div className={className} initial={reduce?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.1}} transition={{duration:.55,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}
