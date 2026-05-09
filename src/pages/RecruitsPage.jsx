import { useState } from 'react';
import { isOfficer } from '../utils/auth';
import RecruitmentTracker from '../components/RecruitmentTracker';

export default function RecruitsPage({ recruits, setRecruits }) {
  const officer = isOfficer();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Rekrutierte Spieler</h1>
        <p className="page-subtitle">Übersicht der rekrutierten Spieler</p>
      </div>

      <RecruitmentTracker recruits={recruits} setRecruits={setRecruits} />
    </div>
  );
}