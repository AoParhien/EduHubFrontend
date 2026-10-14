import React from 'react';
import { formatRupees } from '../../utils/format';
import './FeeTable.css';

const FeeTable = ({ registrationFees = 0, courseFees = 0, oneTimeCharges = 0 }) => {
    const dueOnFirstDay = Number(registrationFees || 0) + Number(courseFees || 0) + Number(oneTimeCharges || 0);

    return (
        <table className="fee-table">
            <caption className="visually-hidden">Fee breakdown</caption>
            <tbody>
                <tr>
                    <th scope="row">
                        Tuition fee
                        <span>Charged every month</span>
                    </th>
                    <td>{formatRupees(courseFees)}</td>
                </tr>
                <tr>
                    <th scope="row">
                        Registration fee
                        <span>One-time, paid when you join</span>
                    </th>
                    <td>{formatRupees(registrationFees)}</td>
                </tr>
                {Number(oneTimeCharges) > 0 && (
                    <tr>
                        <th scope="row">
                            Books and materials
                            <span>One-time, set by the institute</span>
                        </th>
                        <td>{formatRupees(oneTimeCharges)}</td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row">Due on your first day</th>
                    <td>{formatRupees(dueOnFirstDay)}</td>
                </tr>
            </tfoot>
        </table>
    );
};

export default FeeTable;
