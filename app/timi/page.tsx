import TimiCard from '@/components/TimiCard';
import { timiCards } from '@/lib/data/timiCards';

export default function TimiPage() {
  // 지정된 순서대로 정렬
  const ordered = [
    'stable', 'analysis', 'insight', 'creative', 'positive', 'fusion',
    'active', 'adaptive', 'experiment', 'perfect', 'coordination', 'sense'
  ];
  
  const items = ordered
    .map(key => timiCards.find(card => card.key === key))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* 헤더 */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            티미 카드 컬렉션
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            카드를 클릭하면 앞/뒤가 뒤집힙니다. 각 티미의 특성을 확인해보세요!
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <TimiCard
              key={item!.key}
              name={item!.name}
              front={item!.front}
              back={item!.back}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
