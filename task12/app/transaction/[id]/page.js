import TransactionDetail from '../../../components/TransactionDetail';
export default async function TransactionPage({ params }) {
  const { id } = await params;
  return (
    <main>
      <p className="eyebrow">Операция / Подробности</p>
      <h1>
        За каждой суммой —<br />
        своя история.
      </h1>
      <TransactionDetail id={id} />
    </main>
  );
}
