import { Request, Response } from "express";
import EmaMei from "@emajs/mei";
import EmaMeiProcessor from "@emajs/mei";
import {XMLSerializer} from "xmldom";

const express = require('express');
const app = express();

app.get('/', function (req: Request, res: Response) {
    res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>EMA Web API</title>
      </head>
      <body>
        <main>
            <h1>EMA Web API</h1>  
            <p>API wrapper for <a href="https://github.com/music-addressability/ema-for-mei-js">ema-for-mei-js</a></p>
            <p>a processor of Enhancing Music Notation Addressability (EMA) expressions 
            (<a href="https://github.com/music-addressability/ema/blob/master/docs/api.md">read the API specification here</a>) 
            for the Music Encoding Initiative format.</p>
            <p>Usage<br/>
                <code>GET /https%3A%2F%2Fraw.githubusercontent.com%2Fmusic-encoding%2Fsample-encodings%2Fmaster%2FMEI_4.0%2FMusic%2FComplete_examples%2FBach_Musikalisches_Opfer_Trio.mei/all/all/@all</code>
            </p>
        </main>
      </body>
    </html>`)
})

app.get('/:uri/:measures/:staves/:beats/:options?', async function (req: Request, res: Response) {
    const {uri, measures, staves, beats, options} = req.params;
    // example:`/https%3A%2F%2Fraw.githubusercontent.com%2Fmusic-encoding%2Fsample-encodings%2Fmaster%2FMEI_4.0%2FMusic%2FComplete_examples%2FBach_Musikalisches_Opfer_Trio.mei/all/all/@all`
    const fullExpr = `/${encodeURIComponent(uri)}/${measures}/${staves}/${beats}/${options}`;
    try {
        const emaMei: EmaMeiProcessor = await EmaMei.withFullExpr(fullExpr);
        const selection: Document = emaMei.getSelection();
        const mei = (new XMLSerializer).serializeToString(selection);
        res.setHeader('Content-disposition', 'attachment; filename=' + 'selection.mei');
        res.setHeader('Content-type', 'application/xml');
        res.send(mei);
    } catch (err) {
        console.log(err)
        res.send(err);
    }
})

const server = app.listen(8081, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})
