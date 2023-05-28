const { log } = console;


export default function teamAdd(req: any, res: any) {

    if (req.method === "POST")
    {
        const reqPayload = req?.body;
    
        log("Req Payload: ", reqPayload);
        
        //ToDo: Send them to an email

       return res.json({msg: "Yaaayyy i got the message"});
    }
    return res.status(500).json ({
        msg: "This needs to be a post request"
    })
}