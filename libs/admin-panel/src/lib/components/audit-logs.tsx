import { AuditLogsExtended, getLogs } from '@verity/audit-logs';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@verity/ui/table';

export async function AuditLogs() {
  const logs: AuditLogsExtended[] = (await getLogs()) ?? [];

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold li">Audit Logs</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>User</TableCell>
            <TableCell>App</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>DependencyId</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.timestamp.toISOString()}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.user?.email}</TableCell>
              <TableCell>{log.app?.name}</TableCell>
              <TableCell>{log.version?.value}</TableCell>
              <TableCell>{log.dependency?.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
