import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import MezoDomainsABI from "../contracts/MezoDomains.json";
import { LayoutDashboard, ExternalLink } from "lucide-react";

export default function Dashboard({
  provider,
  account,
  contractAddress,
  showToast,
  refreshKey,
}) {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryDomain, setPrimaryDomain] = useState(null);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);

  const fetchUserDomains = useCallback(async () => {
    if (!provider || !account) return;
    if (
      !contractAddress ||
      contractAddress === "0x0000000000000000000000000000000000000000"
    ) {
      console.warn("Contract address not configured.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const contract = new ethers.Contract(
        contractAddress,
        MezoDomainsABI.abi,
        provider,
      );

      // Read current primary domain
      const pDomain = await contract.getPrimaryDomain(account);
      setPrimaryDomain(pDomain && pDomain !== "" ? pDomain : null);

      // Read total minted token count directly from the contract
      const nextId = await contract.nextTokenId();
      const totalMinted = Number(nextId);

      const userDomains = [];
      for (let id = 1; id <= totalMinted; id++) {
        try {
          const currentOwner = await contract.ownerOf(id);
          if (currentOwner.toLowerCase() === account.toLowerCase()) {
            const domainName = await contract.tokenIdToDomain(id);
            userDomains.push({ id: id.toString(), name: domainName });
          }
        } catch (e) {
          // Token burned or doesn't exist — skip
        }
      }

      setDomains(userDomains);
    } catch (error) {
      console.error("Failed to fetch domains:", error);
      if (showToast) {
        showToast("Failed to fetch your domains.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [provider, account, contractAddress, showToast, refreshKey]);

  useEffect(() => {
    fetchUserDomains();
  }, [fetchUserDomains]);

  const handleSetPrimary = async (domainName) => {
    try {
      setIsSettingPrimary(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        MezoDomainsABI.abi,
        signer,
      );

      const tx = await contract.setPrimaryDomain(domainName);
      if (showToast) showToast("Transaction submitted...", "success");

      await tx.wait();

      setPrimaryDomain(domainName);
      if (showToast)
        showToast(`${domainName} is now your primary name!`, "success");

      // Optionally trigger global refresh
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Failed to set primary domain", error);
      if (showToast) showToast("Failed to set primary domain.", "error");
    } finally {
      setIsSettingPrimary(false);
    }
  };

  return (
    <div
      className="glass-panel glass-panel-page animate-fade-in delay-3"
      style={{ padding: "32px", marginBottom: "60px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <LayoutDashboard className="text-secondary" />
        <h2 style={{ fontSize: "24px" }}>Your Domains</h2>
      </div>

      {isLoading ? (
        <div style={{ color: "var(--text-secondary)", padding: "20px 0" }}>
          Loading your domains...
        </div>
      ) : domains.length === 0 ? (
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "12px",
            padding: "32px",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          You don't own any .poor domains yet. Use the search to find and
          register one!
        </div>
      ) : (
        <div
          className="domains-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {domains.map((domain) => (
            <div
              key={domain.id}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)",
                border: "1px solid var(--glass-border)",
                borderRadius: "16px",
                padding: "20px",
                transition: "all var(--transition-normal)",
              }}
            >
              <div
                className="badge badge-available"
                style={{ marginBottom: "12px" }}
              >
                Token ID: {domain.id}
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  color: "var(--accent-color)",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {domain.name}
              </h3>

              <div style={{ marginBottom: "16px" }}>
                {primaryDomain === domain.name ? (
                  <span
                    style={{
                      fontSize: "12px",
                      background: "rgba(16, 185, 129, 0.2)",
                      color: "#10b981",
                      padding: "4px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    Primary Name
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetPrimary(domain.name)}
                    disabled={isSettingPrimary}
                    style={{
                      fontSize: "12px",
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Set as Primary
                  </button>
                )}
              </div>

              <a
                href={`https://explorer.test.mezo.org/address/${contractAddress}?tab=tokens`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                View on Explorer <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
