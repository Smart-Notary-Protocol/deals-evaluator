/**
@dev want client address and epoch
 *  */
export const ProviderDistributionQuery = `
      WITH miner_pieces AS (SELECT provider,
                                   piece_cid,
                                   SUM(piece_size) AS total_deal_size,
                                   MIN(piece_size) AS piece_size
                            FROM current_state,
                                 client_mapping
                            WHERE client_address = ANY($1)
                              AND current_state.client = client_mapping.client
                              AND verified_deal = true
                              AND slash_epoch < 0
                              AND (sector_start_epoch > 0 AND sector_start_epoch < $2)
                              AND end_epoch > $2
                            GROUP BY provider, piece_cid),
           miners AS (SELECT provider,
                             SUM(total_deal_size) AS total_deal_size,
                             SUM(piece_size)      AS unique_data_size
                      FROM miner_pieces
                      GROUP BY provider)
      SELECT miners.provider,
             total_deal_size,
             unique_data_size,
             (total_deal_size::FLOAT - unique_data_size) / total_deal_size::FLOAT AS duplication_percentage
      FROM miners
      ORDER BY total_deal_size DESC`

/**
@dev want client address and epoch
 *  */
export const ReplicaDistributionQuery = `
      WITH replicas AS (SELECT COUNT(DISTINCT provider) AS num_of_replicas,
                               SUM(piece_size)          AS total_deal_size,
                               MAX(piece_size)          AS piece_size,
                               piece_cid
                        FROM current_state,
                             client_mapping
                        WHERE client_address = ANY($1)
                          AND current_state.client = client_mapping.client
                          AND verified_deal = true
                          AND slash_epoch < 0
                          AND (sector_start_epoch > 0 AND sector_start_epoch < $2)
                          AND end_epoch > $2
                        GROUP BY piece_cid)
      SELECT SUM(total_deal_size) AS total_deal_size,
             SUM(piece_size)      AS unique_data_size,
             num_of_replicas::INT
      FROM replicas
      GROUP BY num_of_replicas
      ORDER BY num_of_replicas ASC`

/**
@dev want client address
 *  */
export const CidSharingQuery = `
      WITH cids AS (SELECT DISTINCT piece_cid
                    FROM current_state,
                         client_mapping
                    WHERE client_address = ANY($1)
                      AND current_state.client = client_mapping.client
                      AND current_state.verified_deal = true
                      AND verified_deal = true)
      SELECT SUM(piece_size)                              AS total_deal_size,
             COUNT(DISTINCT current_state.piece_cid)::INT AS unique_cid_count,
             client_address                               as other_client_address
      FROM cids,
           current_state,
           client_mapping
      WHERE cids.piece_cid = current_state.piece_cid
        AND current_state.client = client_mapping.client
        AND NOT (client_address = ANY($1))
      GROUP BY client_address
      ORDER BY total_deal_size DESC`