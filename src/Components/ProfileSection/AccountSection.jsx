import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .as-wrap {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
  }

  .as-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 800;
    color: #111;
    margin: 0 0 18px;
    letter-spacing: -0.3px;
  }

  .as-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
  }

  /* Card */
  .as-card {
    border-radius: 14px;
    border: 1.5px solid #efefef;
    background: #fafafa;
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .as-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.07);
  }

  .as-card-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #bbb;
    margin: 0;
  }

  /* Status badge */
  .as-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    width: fit-content;
  }

  .as-status.yes {
    background: #dcfce7;
    color: #16a34a;
  }

  .as-status.no {
    background: #fee2e2;
    color: #dc2626;
  }

  .as-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .yes .as-status-dot  { background: #16a34a; }
  .no  .as-status-dot  { background: #dc2626; }

  /* Date value */
  .as-value {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: #111;
    margin: 0;
    line-height: 1.2;
  }
`;

function AccountSection({ user }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const cards = [
    {
      label: "Email Verified",
      type: "status",
      value: user?.isEmailVerified,
      yes: "Verified",
      no: "Not Verified",
    },
    {
      label: "Profile Complete",
      type: "status",
      value: user?.isProfileComplete,
      yes: "Completed",
      no: "Incomplete",
    },
    {
      label: "Last Login",
      type: "date",
      value: formatDate(user?.lastLogin),
    },
    {
      label: "Joined On",
      type: "date",
      value: formatDate(user?.createdAt),
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="as-wrap">
        <h3 className="as-title">Account Info</h3>
        <div className="as-grid">
          {cards.map(({ label, type, value, yes, no }) => (
            <div className="as-card" key={label}>
              <p className="as-card-label">{label}</p>
              {type === "status" ? (
                <span className={`as-status ${value ? "yes" : "no"}`}>
                  <span className="as-status-dot" />
                  {value ? yes : no}
                </span>
              ) : (
                <p className="as-value">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AccountSection;