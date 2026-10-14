import React from 'react';
import { Link } from 'react-router-dom';
import { formatRupees } from '../../utils/format';
import './instituteCard.css';

const InstituteCard = ({ _id, name, registrationFees, pictureUrl, logoUrl }) => (
    <Link to={`/institute/${_id}`} className="institute-card">
        <div className="institute-card__media">
            {pictureUrl && <img src={pictureUrl} alt="" loading="lazy" />}
        </div>
        <div className="institute-card__body">
            {logoUrl ? (
                <img className="institute-card__logo" src={logoUrl} alt="" loading="lazy" />
            ) : (
                <span className="institute-card__logo institute-card__logo--empty" aria-hidden="true">{name?.[0]}</span>
            )}
            <div className="institute-card__text">
                <h2>{name}</h2>
                {registrationFees != null && (
                    <p>Registration fee {formatRupees(registrationFees)}</p>
                )}
            </div>
        </div>
    </Link>
);

export default InstituteCard;
