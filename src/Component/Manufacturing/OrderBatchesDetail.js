import React from 'react';
import { Table } from 'react-bootstrap';

function OrderBatchesDetail({order}) {
    return (
        <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th>Batch And Weight(grams)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                order.materials?.map((mat) => (
                                    <tr>
                                        <td>{mat.materialName}</td>
                                        <td>
                                            <thead>
                                                <tr>
                                                    <th>BatchId</th>
                                                    <th>Weight(gm)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mat.batches?.map((batch) => (
                                                    <tr>
                                                        <td>{batch.batchId}</td>
                                                        <td>{batch.weight}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
    );
}

export default OrderBatchesDetail;