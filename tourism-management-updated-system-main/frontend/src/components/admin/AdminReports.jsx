import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSummary, getRequests, getPayments, getReports } from './adminService';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminReports() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    getReports().then(setReports);
  }, []);

  const handleExportCSV = () => {
    // Basic CSV export
    let csv = 'Guide Name,Site,Visitor,Date,Report\n';
    reports.forEach(r => {
      csv += `"${r.guide_name} ${r.guide_last}","${r.site_name}","Request #${r.request_id}","${r.report_date}","${r.report_text.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Simple print for PDF export
    window.print();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <h1>{t('title_reports_analytics')}</h1>
          <ThemeToggle />
        </header>

        <section className="panel">
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_visits_report')}</h4>
                <p><strong>{t('lbl_total_requests')}:</strong> {requests.length}</p>
                <p><strong>{t('lbl_completed_visits')}:</strong> {requests.filter(r => r.request_status === 'completed').length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_payments_report')}</h4>
                <p><strong>{t('lbl_total_payments')}:</strong> {payments.length}</p>
                <p><strong>{t('lbl_confirmed_revenue')}:</strong> {payments.filter(p => p.payment_status === 'confirmed').reduce((acc, curr) => acc + Number(curr.total_amount || curr.amount || 0), 0)} ETB</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_user_activity')}</h4>
                <p><strong>{t('lbl_total_users')}:</strong> {summary?.totalUsers || 0}</p>
                <p><strong>{t('lbl_active_sites')}:</strong> {summary?.totalSites || 0}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3>Guide Reports</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button className="btn-primary" onClick={handleExportCSV}>{t('btn_export_csv')}</button>
              <button className="btn-outline" onClick={handleExportPDF}>{t('btn_export_pdf')}</button>
            </div>
            {reports.length === 0 ? (
              <p>No reports submitted yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Guide</th>
                      <th>Site</th>
                      <th>Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(report => (
                      <tr key={report.report_id}>
                        <td>{new Date(report.report_date).toLocaleDateString()}</td>
                        <td>{report.guide_name} {report.guide_last}</td>
                        <td>{report.site_name}</td>
                        <td>{report.report_text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
