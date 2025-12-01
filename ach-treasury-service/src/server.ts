import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import achBatchesApi from "./api/achBatches";
import returnsApi from "./api/returns";
import reclamationsApi from "./api/reclamations";
import consentsApi from "./api/consents";
import formsApi from "./api/forms";
import packsApi from "./api/packs";

const app = express();
app.use(bodyParser.json());

app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

app.use(achBatchesApi);
app.use(returnsApi);
app.use(reclamationsApi);
app.use(consentsApi);
app.use(formsApi);
app.use(packsApi);

const port = Number(process.env.PORT || 8443);
app.listen(port, () => {
  console.log(`ACH & Treasury Service listening on port ${port}`);
});
