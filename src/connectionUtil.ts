class ConnectionUtil {
  getConnectionPrefix(connection: Deno.Conn): string {
    let addr = connection.remoteAddr;
    if (["tcp", "udp"].includes(addr.transport)) {
      addr = addr as Deno.NetAddr;
      return `${addr.hostname}:${addr.port}>`;
    } else {
      addr = addr as Deno.UnixAddr;
      return `${addr.path}>`;
    }
  }
}

export default ConnectionUtil;
