import Image from "next/image";

interface UserCardProps {
  type: string;
  count: number; // ✅ Add this
}

const UserCard = ({ type, count }: UserCardProps) => {
  return (
    <div className="rounded-2xl bg-josseypink1 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-black">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-white">{type}s</h2>
    </div>
  );
};

export default UserCard;
