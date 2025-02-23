import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import createClickhouseClient from '@utils/createClickhouseClient';
import { invalidBody, noBody } from '@utils/responses';
import type { Handler } from 'express';
import { array, object, string } from 'zod';

type ExtensionRequest = {
  viewer_id: string;
  ids: string[];
};

const validationSchema = object({
  viewer_id: string(),
  ids: array(string())
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { viewer_id, ids } = body as ExtensionRequest;

  try {
    const values = ids.map((id) => ({
      viewer_id,
      publication_id: id
    }));

    const client = createClickhouseClient();
    const result = await client.insert({
      table: 'impressions',
      values,
      format: 'JSONEachRow'
    });
    logger.info('Ingested impressions to Leafwatch');

    return res.status(200).json({ success: true, id: result.query_id });
  } catch (error) {
    return catchedError(res, error);
  }
};
