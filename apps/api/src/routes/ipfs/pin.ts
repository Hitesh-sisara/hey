import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { noBody } from '@utils/responses';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { cid } = req.query;

  if (!cid) {
    return noBody(res);
  }

  try {
    const ipfsResponse = await fetch(
      `https://cl-api.ipfs-lens.dev/pins/${cid}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.LENS_IPFS_AUTH_KEY}`,
          'X-App': 'hey.xyz'
        }
      }
    );

    const json: { cid: string } = await ipfsResponse.json();
    logger.info(`Pinned ${cid} to IPFS`);

    return res.status(200).json({ success: true, cid: json.cid });
  } catch (error) {
    return catchedError(res, error);
  }
};
