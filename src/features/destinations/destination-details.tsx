import type { Destination } from "./data";
const formatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: "UTC" });
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function dateLabel(value: string) { return formatter.format(new Date(`${value}T12:00:00Z`)); }
export function DestinationDetails({ destination }: { destination: Destination }) {
  const dates = destination.dates.filter(date => validDate(date.departure));
  const price = destination.price;
  const hasPrice = price && Number.isFinite(price.amount) && price.amount >= 0 && ["ARS", "USD"].includes(price.currency);
  const services = destination.services.filter(service => service.trim());
  if (!destination.description?.trim() && !dates.length && !hasPrice && !services.length) return null;
  return <div className="destination-details">
    {destination.description?.trim() && <p>{destination.description}</p>}
    {dates.length > 0 && <ul aria-label="Fechas de viaje">{dates.map(date => <li key={date.departure}>
      Salida: <time dateTime={date.departure}>{dateLabel(date.departure)}</time>
      {date.return && validDate(date.return) && date.return >= date.departure && <> · Regreso: <time dateTime={date.return}>{dateLabel(date.return)}</time></>}
    </li>)}</ul>}
    {hasPrice && <p className="destination-price">{new Intl.NumberFormat("es-AR", { style: "currency", currency: price.currency, currencyDisplay: "code", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(price.amount)}</p>}
    {services.length > 0 && <ul aria-label="Servicios incluidos">{services.map(service => <li key={service}>{service}</li>)}</ul>}
  </div>;
}
