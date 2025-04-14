import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  StatusGrid,
  StatusCard,
  StatusCardTitle,
  StatusIndicator,
  StatusValue,
  Badge,
  ModuleCard,
  ModuleHeader,
  ModuleName,
  ModuleStatus,
  ModuleDescription,
  MethodsList,
  Method,
  RefreshButton,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
  ExportsList,
  ExportItem,
  Pre,
  LoadingIndicator,
  Error,
} from "./Status.styles";

interface SystemInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  totalMemory: string;
  freeMemory: string;
  uptime: string;
}

interface StatusResponse {
  initialized: boolean;
  exports: string[];
  modules?: {
    [key: string]: {
      initialized: boolean;
      available: boolean;
      methods?: string[];
      error?: string;
    };
  };
  system?: SystemInfo;
  initTime?: string;
  timeToInit?: string;
  error?: string;
}

function StatusPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/status");

      if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.statusText}`);
      }

      const data = await response.json();
      setStatus(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRefresh = () => {
    fetchStatus();
  };

  if (loading && !status) {
    return (
      <Container>
        <Header>
          <Title>System Status</Title>
          <Subtitle>WASM initialization and system information.</Subtitle>
        </Header>
        <LoadingIndicator>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#E2E8F0" strokeWidth="4" />
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ marginLeft: "12px" }}>
            Loading status information...
          </span>
        </LoadingIndicator>
      </Container>
    );
  }

  if (error && !status) {
    return (
      <Container>
        <Header>
          <Title>System Status</Title>
          <Subtitle>WASM initialization and system information.</Subtitle>
        </Header>
        <Error>
          <strong>Error loading status information:</strong> {error}
          <div style={{ marginTop: "12px" }}>
            <RefreshButton onClick={handleRefresh}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 4V10H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 20V14H7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.49 9C19.2714 6.33172 16.8037 4.36911 13.9402 3.5933C11.0767 2.81749 8.0353 3.29901 5.56476 4.91836C3.09422 6.53772 1.43417 9.14802 1.01882 12.0709C0.603483 14.9938 1.47084 17.9727 3.39 20.19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.51001 15C4.7286 17.6683 7.19636 19.6309 10.0599 20.4067C12.9234 21.1825 15.9648 20.701 18.4353 19.0816C20.9059 17.4623 22.5659 14.852 22.9813 11.9291C23.3966 9.00621 22.5293 6.02729 20.61 3.81"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Try Again
            </RefreshButton>
          </div>
        </Error>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>System Status</Title>
        <Subtitle>WASM initialization and system information.</Subtitle>
      </Header>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <RefreshButton onClick={handleRefresh}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 4V10H17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 20V14H7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.49 9C19.2714 6.33172 16.8037 4.36911 13.9402 3.5933C11.0767 2.81749 8.0353 3.29901 5.56476 4.91836C3.09422 6.53772 1.43417 9.14802 1.01882 12.0709C0.603483 14.9938 1.47084 17.9727 3.39 20.19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.51001 15C4.7286 17.6683 7.19636 19.6309 10.0599 20.4067C12.9234 21.1825 15.9648 20.701 18.4353 19.0816C20.9059 17.4623 22.5659 14.852 22.9813 11.9291C23.3966 9.00621 22.5293 6.02729 20.61 3.81"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Refresh Status
        </RefreshButton>
      </div>

      {error && (
        <Error>
          <strong>Error refreshing status:</strong> {error}
        </Error>
      )}

      {loading && status && (
        <LoadingIndicator>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#E2E8F0" strokeWidth="4" />
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ marginLeft: "12px" }}>
            Refreshing status information...
          </span>
        </LoadingIndicator>
      )}

      {status && (
        <>
          <Card>
            <CardTitle>WASM Status</CardTitle>
            <StatusGrid>
              <StatusCard status={status.initialized ? "success" : "error"}>
                <StatusCardTitle>
                  <StatusIndicator
                    status={status.initialized ? "success" : "error"}
                  />
                  Initialization Status
                </StatusCardTitle>
                <StatusValue>
                  <Badge status={status.initialized ? "success" : "error"}>
                    {status.initialized ? "Initialized" : "Not Initialized"}
                  </Badge>
                  {status.timeToInit && (
                    <div style={{ marginTop: "8px" }}>
                      <small>Initialization Time: {status.timeToInit}</small>
                    </div>
                  )}
                </StatusValue>
              </StatusCard>

              <StatusCard status="info">
                <StatusCardTitle>
                  <StatusIndicator status="info" />
                  Last Status Check
                </StatusCardTitle>
                <StatusValue>
                  {lastRefresh.toLocaleTimeString()} -{" "}
                  {lastRefresh.toLocaleDateString()}
                </StatusValue>
              </StatusCard>

              {status.initTime && (
                <StatusCard status="info">
                  <StatusCardTitle>
                    <StatusIndicator status="info" />
                    WASM Init Timestamp
                  </StatusCardTitle>
                  <StatusValue>
                    {new Date(status.initTime).toLocaleTimeString()} -{" "}
                    {new Date(status.initTime).toLocaleDateString()}
                  </StatusValue>
                </StatusCard>
              )}

              {status.system && (
                <StatusCard status="info">
                  <StatusCardTitle>
                    <StatusIndicator status="info" />
                    Server Uptime
                  </StatusCardTitle>
                  <StatusValue>{status.system.uptime}</StatusValue>
                </StatusCard>
              )}
            </StatusGrid>

            {status.modules && Object.keys(status.modules).length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "16px 0",
                  }}
                >
                  WASM Modules
                </h3>
                {Object.entries(status.modules).map(
                  ([moduleName, moduleInfo]) => (
                    <ModuleCard key={moduleName}>
                      <ModuleHeader>
                        <ModuleName>
                          <StatusIndicator
                            status={
                              moduleInfo.initialized
                                ? "success"
                                : moduleInfo.available
                                  ? "warning"
                                  : "error"
                            }
                          />
                          {moduleName}
                        </ModuleName>
                        <ModuleStatus>
                          <Badge
                            status={
                              moduleInfo.initialized
                                ? "success"
                                : moduleInfo.available
                                  ? "warning"
                                  : "error"
                            }
                          >
                            {moduleInfo.initialized
                              ? "Initialized"
                              : moduleInfo.available
                                ? "Available but not initialized"
                                : "Not Available"}
                          </Badge>
                        </ModuleStatus>
                      </ModuleHeader>

                      {moduleInfo.error && (
                        <ModuleDescription style={{ color: "#ef4444" }}>
                          Error: {moduleInfo.error}
                        </ModuleDescription>
                      )}

                      {moduleInfo.methods && (
                        <>
                          {moduleInfo.methods.static?.length > 0 && (
                            <>
                              <ModuleDescription>
                                Static Methods:
                              </ModuleDescription>
                              <MethodsList>
                                {moduleInfo.methods.static.map((method) => (
                                  <Method
                                    key={`static-${method}`}
                                    available={moduleInfo.initialized}
                                  >
                                    {method}
                                  </Method>
                                ))}
                              </MethodsList>
                            </>
                          )}

                          {moduleInfo.methods.instance?.length > 0 && (
                            <>
                              <ModuleDescription>
                                Instance Methods:
                              </ModuleDescription>
                              <MethodsList>
                                {moduleInfo.methods.instance.map((method) => (
                                  <Method
                                    key={`instance-${method}`}
                                    available={moduleInfo.initialized}
                                  >
                                    {method}
                                  </Method>
                                ))}
                              </MethodsList>
                            </>
                          )}
                        </>
                      )}
                    </ModuleCard>
                  )
                )}
              </div>
            )}

            {status.exports && status.exports.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "16px 0",
                  }}
                >
                  WASM Exports
                </h3>
                <ExportsList>
                  {status.exports.map((exp, index) => (
                    <ExportItem key={index}>{exp}</ExportItem>
                  ))}
                </ExportsList>
              </div>
            )}
          </Card>

          {status.system && (
            <Card>
              <CardTitle>System Information</CardTitle>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Property</TableHeaderCell>
                    <TableHeaderCell>Value</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow>
                    <TableCell>Node Version</TableCell>
                    <TableCell>{status.system.nodeVersion}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell>{status.system.platform}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Architecture</TableCell>
                    <TableCell>{status.system.arch}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Memory</TableCell>
                    <TableCell>{status.system.totalMemory}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Free Memory</TableCell>
                    <TableCell>{status.system.freeMemory}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Uptime</TableCell>
                    <TableCell>{status.system.uptime}</TableCell>
                  </TableRow>
                </tbody>
              </Table>
            </Card>
          )}

          {/* Display full status as JSON for debugging purposes */}
          <Card>
            <CardTitle>Raw Status Data</CardTitle>
            <Pre>{JSON.stringify(status, null, 2)}</Pre>
          </Card>
        </>
      )}
    </Container>
  );
}

export default StatusPage;
