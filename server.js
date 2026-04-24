import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
app.get('/filteredimage', async (req, res) => {
  const imageUrl = req.query.image_url;
  if (!imageUrl) {
    return res.status(400).send({ message: 'image_url query parameter is required.' });
  }
  try {
    const filteredPath = await filterImageFromURL(imageUrl);
    res.sendFile(filteredPath, {}, (err) => {
      deleteLocalFiles([filteredPath]);
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    res.status(422).send({ message: 'Unable to process image.', error: error.toString() });
  }
});

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
