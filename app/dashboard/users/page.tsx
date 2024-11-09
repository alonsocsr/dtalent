"use client";

import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { User } from '@/lib/types';
import { FaUserEdit, FaSearch, FaChevronLeft, FaChevronRight, FaTimes, FaHeartBroken } from 'react-icons/fa';
import { fetchUsers } from '@/lib/fetch';


interface Pagination {
  currentPage: number;
  totalCount: number;
  numPages: number;
  next: string | null;
  previous: string | null;
};

type FilterOptionKeys = keyof typeof filterOptions;

const filterOptions = {
  Remuneración: ["Jornalero", "Por hora"],
  Puesto: ["Manager", "Developer", "Designer"],
  Sección: ["Dev", "Marketing", "IT"],
  Turno: ["Mañana", "Tarde", "Noche"],
  Estado: ["Activo", "Inactivo"],
  Nacionalidad: ["Paraguaya", "Aleman", "Canadiense"],
  Rol: ["Administrador", "Funcionario", "Supervisor"],
};

// Mapeo para traducir los valores del filtro al formato de la API
const filterMapping: { [key in keyof typeof filterOptions]: { [key: string]: string } } = {
  Remuneración: { "Jornalero": "Jornalero", "Por hora": "hourly" },
  Puesto: { "Manager": "manager", "Developer": "developer", "Designer": "designer" },
  Sección: { "Dev": "Dev", "Marketing": "marketing", "IT": "it" },
  Turno: { "Mañana": "8-16", "Tarde": "afternoon", "Noche": "night" },
  Estado: { "Activo": "true", "Inactivo": "false" },
  Nacionalidad: { "Paraguaya": "Paraguaya", "Aleman": "Aleman", "Canadiense": "Canadiense" },
  Rol: { "Funcionario": "Funcionario", "Supervisor": "Supervisor" },
};

// Mapeo de las claves en español a las claves en inglés para la API
const filterKeyMapping: { [key in keyof typeof filterOptions]: string } = {
  Remuneración: "remunerationType",
  Puesto: "position",
  Sección: "section",
  Turno: "workshift",
  Estado: "isActive",
  Nacionalidad: "nationality",
  Rol: "role",
};

const sortMapping: { [key: string]: string } = {
  "Número": "employeeNumber",
  "Más reciente": "modifieddAt",
  "Más antiguo": "createdAt",
  "Nombre": "fullName",
  "Apellido": "lastName",
  "Correo electrónico": "email"
};

const UsersPage = () => {
  const { token, isTokenLoaded } = useUser();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<{ [key: string]: string }>({});
  const [sort, setSort] = useState<string>('numero');
  const [sortVisible, setSortVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedFilterValues, setSelectedFilterValues] = useState<{
    [key in FilterOptionKeys]?: string;
  }>({});
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalCount: 0,
    numPages: 1,
    next: null,
    previous: null,
  });

  const fetchUsersData = async () => {
    if (!isTokenLoaded) {
      console.error("Token is still loading or unavailable.");
      return;
    }
  
    if (!token) {
      console.error("No token provided.");
      return;
    }

    let queryParams = "";
  
    for (const [key, value] of Object.entries(filter)) {
      if (value) {
        queryParams += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    }

    // Agregar el filtro de búsqueda si existe
    if (search) {
      queryParams += `&search=${encodeURIComponent(search)}`;
    }

    // Construcción de la URL con los filtros y otros parámetros
    const url = `/users/?page=${pagination.currentPage}&sort=${sort}${queryParams}`;
  
    try {
      const data = await fetchUsers({
        token: token,
        url: url,
      });
      setUsers(data.results);
      setPagination({
        currentPage: pagination.currentPage,
        totalCount: data.totalCount,
        numPages: data.numPages,
        next: data.next,
        previous: data.previous,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (!isTokenLoaded || !token) {
      return;
    }
    fetchUsersData();
  }, [token, search, isTokenLoaded, sort, filter]);

  if (!isTokenLoaded) {
    return <div>Cargando...</div>;
  }


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };  

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    const apiSortKey = sortMapping[selectedSort] || "employeeNumber";
    setSort(apiSortKey);
  };

  const handleFilterChange = (field: keyof typeof filterOptions, value: string) => {
    const apiFieldKey = filterKeyMapping[field]; // Traducir la clave al inglés
    const apiFilterValue = filterMapping[field][value] || "";
  
    setFilter((prev) => (value ? { ...prev, [apiFieldKey]: apiFilterValue } : { ...prev, [apiFieldKey]: "" }));
  };
  

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleFilterSelection = (filter: FilterOptionKeys, value: string) => {
    setSelectedFilterValues((prev) => ({
      ...prev,
      [filter]: value,
    }));
    handleFilterChange(filter, value);
    setFiltersVisible(false);
  };

  const handleRemoveFilter = (filter: FilterOptionKeys) => {
    setSelectedFilterValues((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [filter]: _, ...rest } = prev;
      return rest;
    });
    handleFilterChange(filter, "");
  };

  const handlePageChange = (direction: "next" | "previous") => {
    setPagination((prev) => ({
      ...prev,
      currentPage: direction === "next" ? prev.currentPage + 1 : prev.currentPage - 1,
    }));
  };

  const toggleSort = () => setSortVisible((prev) => !prev);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className='flex justify-between items-center space-x-2 mb-4'>
        <div className='flex space-x-2'>
          <h2 className="text-3xl font-semibold text-gray-800">
            Lista de empleados 
          </h2>
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mt-1">{pagination.totalCount}</span>
        </div>
        <div className="flex justify-end space-x-2 items-end">
          <button className="bg-white text-gray-400 font-semibold px-4 py-2 rounded-md border-gray-500">IMPORTAR</button>
          <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md">+ NUEVO EMPLEADO</button>
         </div>
      </div>

      
      <div className="relative">
      {/* Sorting and Filter Toggle Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Ordenar por:</span>
          <div className="relative">
            <button
              className="bg-transparent font-semibold"
              onClick={toggleSort}
            >
               {Object.keys(sortMapping).find(key => sortMapping[key] === sort) ?? "Número"}
            </button>
            {sortVisible && (
              <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-md p-2 z-10 w-40">
                {["Número", "Más reciente", "Más antiguo", "Nombre", "Apellido", "Correo electrónico"].map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      handleSortChange({ target: { value: option } } as React.ChangeEvent<HTMLSelectElement>);
                      setSortVisible(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            className="text-blue-600"
            onClick={toggleFilters}
          >
            {filtersVisible ? "Cerrar filtro" : "Agregar filtro +"}
          </button>
        </div>
        <div className="relative w-1/3">
      <input
        type="text"
        placeholder="Buscar empleados"
        value={search}
        onChange={handleSearch}
        className="px-4 py-2 pr-10 border rounded-md shadow-sm w-full"
      />
      <FaSearch
        size={20}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        onClick={() => console.log("Realizando búsqueda de:", search)}
      />
    </div>
      </div>

      {/* Show selected filters */}
      <div className="mb-4 flex flex-wrap">
        {Object.keys(selectedFilterValues).map((key) => {
          const filterKey = key as FilterOptionKeys;
          return (
            <div key={filterKey} className="flex items-center space-x-2 bg-gray-200 p-2 rounded-lg mr-2 mb-2">
              <span>{`${filterKey}: ${selectedFilterValues[filterKey]}`}</span>
              <button
                onClick={() => handleRemoveFilter(filterKey)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          );
        })}
      </div>

      {/* Filters Dropdown */}
      {filtersVisible && (
        <div className="absolute mt-2 left-0 bg-white border border-gray-300 rounded-md shadow-md p-4 z-10 w-64">
          {Object.keys(filterOptions).map((key) => {
            const filterKey = key as FilterOptionKeys;
            return (
              <div key={filterKey} className="mb-4">
                <label className="block text-sm font-medium capitalize mb-2">
                  {filterKey}:
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  value={selectedFilterValues[filterKey] || ""}
                  onChange={(e) => handleFilterSelection(filterKey, e.target.value)}
                >
                  <option value="">Todas</option>
                  {filterOptions[filterKey].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>

    <div>
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <FaHeartBroken size={80} color="red" />
          <p className="text-center text-gray-400 mt-4">
            Lo lamentamos, no se han encontrado registros disponibles en esta página.
          </p>
        </div>
      ) : (
        <>
          <div className='overflow-hidden border border-gray-200 rounded-lg'>
            <table className="w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-left">
                <th className="px-6 py-4 font-semibold">Número</th>
                <th className="px-6 py-4 font-semibold">Nombre</th>
                <th className="px-6 py-4 font-semibold">Correo electrónico</th>
                <th className="px-6 py-4 font-semibold">Teléfono / Celular</th>
                <th className="px-6 py-4 font-semibold">Estatus</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      {u.initials}
                    </div>
                    <span className="text-blue-500 font-semibold">#{u.employeeNumber}</span>
                  </td>
                  <td className="px-6 py-4">{u.fullName}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.phoneNumber}</td>
                  <td className="px-6 py-4 flex ">
                    <div className="flex items-center text-center space-x-2 rounded-full bg-green-700">
                      <div className={`text-${true ? 'white' : 'red'} flex items-center text-center p-2 font-semibold`}>
                        {true ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-500 cursor-pointer">
                    <FaUserEdit />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => handlePageChange("previous")}
            disabled={!pagination.previous}
            className={`${
              pagination.previous ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <FaChevronLeft />
          </button>
          <span className="text-gray-700 font-semibold">
            Página {pagination.currentPage} de {pagination.numPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={!pagination.next}
            className={`${
              pagination.next ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
        </>
      )}
    </div>
          
    </div>
  );
};

export default UsersPage;