import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req, res ) => {
    let image_url = req.query.image_url;

    if (!image_url) {
      return res.status(400).send({ message: 'invalid image_url' })
    }

    const filteredImage: string = await filterImageFromURL(image_url)
    res.sendFile(filteredImage, () => {
      deleteLocalFiles([filteredImage])
    })
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();