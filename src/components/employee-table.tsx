import SendingMail from "./sending-mail";

export type Item = {
  basic_salary: number;
  total: number;
  conveyance: number;
  email: string;
  first_name: string;
  last_name: string;
  month: string;
  year: number;
  designation: string;
};

const EmployeeTable = ({ data }: { data: Item[] }) => {
  return (
    <div className="w-full">
      <div className="shadow-md rounded-lg py-6">
        <div className="mb-8 text-left px-6">
          <h2 className="text-xl font-semibold">Employees</h2>
          <p className="text-gray-600 text-sm">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="text-gray-700 text-left">
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Designation</th>
                <th className="px-4 py-2">Basic Salary</th>
                <th className="px-4 py-2">Total Salary</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-left">
              {data &&
                data?.map((emp, i) => (
                  <tr className="border-t" key={i}>
                    <td className="py-3 px-4 font-medium">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="py-3 px-4">{emp.designation}</td>
                    <td className="py-3 px-4">{emp.email.toLowerCase()}</td>
                    <td className="py-3 px-4">{emp.basic_salary}</td>
                    <td className="py-3 px-4">{emp.total}</td>
                    <td className="py-3 px-4 text-indigo-600 hover:underline cursor-pointer">
                      <SendingMail emp={emp} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
