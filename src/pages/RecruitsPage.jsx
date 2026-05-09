import { useState } from 'react';
import RecruitmentTracker from '../components/RecruitmentTracker';

export default function RecruitsPage({ recruits, setRecruits, isOfficer }) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Rekrutierte Spieler</h1>
        <p className="page-subtitle">Übersicht der rekrutierten Spieler</p>
      </div>

      <RecruitmentTracker recruits={recruits} setRecruits={setRecruits} isOfficer={isOfficer} />
    </div>
  );
}