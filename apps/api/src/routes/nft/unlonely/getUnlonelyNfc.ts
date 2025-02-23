import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import { noBody } from '@utils/responses';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const unlonelyResponse = await fetch(
      'https://unlonely-vqeii.ondigitalocean.app/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-agent': 'Hey.xyz'
        },
        body: JSON.stringify({
          query: `
            query GetNFC {
              getNFC(id: "${id}") {
                id
                createdAt 
                videoLink
                videoThumbnail
                openseaLink
                title
                owner {
                  username
                  FCImageUrl
                  lensImageUrl
                }
              }
            }
          `
        })
      }
    );
    const nfc: {
      data: { getNFC: any };
    } = await unlonelyResponse.json();
    logger.info('NFC fetched from Unlonely');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        nfc: nfc.data.getNFC
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
