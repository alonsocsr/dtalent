"use client"

import { useState, useEffect } from "react";
import { FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { fetchReceipts, fetchReceiptFile } from "@/lib/fetch";
import { useUser } from '../../context/UserContext';
import { FaChevronLeft, FaChevronRight, FaHeartBroken, FaSearch } from "react-icons/fa";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Receipt {
  id: string;
  type: string;
  employeeFullName: string;
  employeeNumber: string;
  year: number;
  month: number;
  isSended: boolean;
  isReaded: boolean;
  isSigned: boolean;
  sendedDate: string;
  readedDate: string;
  signedDate: string | null;
}

export default function RecibosPage() {
  const { token, isTokenLoaded } = useUser();

  const [recibos, setRecibos] = useState<Receipt[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState({ isSended: "", isReaded: "", isSigned: "" });
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl = '/receipts/';

  const loadReceipts = async (url: string) => {
    if (!isTokenLoaded) {
      console.error("Token is still loading or unavailable.");
      return;
    }
  
    if (!token) {
      console.error("No token provided.");
      return;
    }

    try {
      let queryParams = `?year=2024`;

      if (search) queryParams += `&search=${encodeURIComponent(search)}`;
      if (filterStatus.isSended) queryParams += `&isSended=${filterStatus.isSended}`;
      if (filterStatus.isReaded) queryParams += `&isReaded=${filterStatus.isReaded}`;
      if (filterStatus.isSigned) queryParams += `&isSigned=${filterStatus.isSigned}`;
      if (sortOrder) queryParams += `&sort=${sortOrder}`;

      const data = await fetchReceipts({ url: url + queryParams, token });
      setRecibos(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);

      if (data.next) {
        setCurrentPage(currentPage + 1);
      } else if (data.previous) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Failed to load receipts:", error);
  };
}

  // Cargar recibos al montar el componente
  useEffect(() => {
    if (!isTokenLoaded || !token) {
      return;
    }
    loadReceipts(baseUrl);
  }, [token, search, filterStatus, sortOrder]);

  if (!isTokenLoaded) {
    return <div>Cargando...</div>;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleFilterChange = (field: keyof typeof filterStatus, value: string) => {
    setFilterStatus((prev) => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const handlePageChange = (url: string | null) => {
    if (url) loadReceipts(url);
  };

  const formatRelativeDate = (dateString: string | null) => {
    return dateString ? formatDistanceToNow(parseISO(dateString), { addSuffix: true ,locale: es}) : "-";
  };

  // Función para manejar el clic en una fila y abrir el PDF
  const handleRowClick = async (id: string) => {
    if (!token) return;

    try {
      // Llamamos a la función fetchReceiptFile para obtener el enlace del archivo PDF
      const data = await fetchReceiptFile({ id, token });
      const fileUrl = data.file;

      window.open(fileUrl, "_blank");

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `Recibo-${id}.pdf`;
      document.body.appendChild(link);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al obtener el enlace del archivo PDF", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
          <div className='flex space-x-2'>
            <h2 className="text-3xl font-semibold">Lista de recibos</h2>
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
              {recibos.length}
            </span>
          </div>
        <button
          onClick={() => loadReceipts(baseUrl)} // Botón para refrescar la lista
          className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
        >
          <FiRefreshCw />
          <span>Refrescar lista de recibos</span>
        </button>
      </div>

      
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span>Ordenar por</span>
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="date_desc">Más recientes</option>
                <option value="date_asc">Más antiguos</option>
              </select>
              <button 
                className="text-blue-600"
                onClick={toggleFilters}
              > 
                Agregar filtro +
              </button>
          </div>
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Buscar recibos"
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

          <div className="flex mb-4">
            {/* Filtros */}
            {filtersVisible && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <select
                        value={filterStatus.isSended}
                        onChange={(e) => handleFilterChange("isSended", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Enviado</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                        <option value="">Limpiar filtro: Enviado</option>
                      </select>
                    </div> 
    
                    <div className="flex items-center space-x-2">
                      <select
                        value={filterStatus.isReaded}
                        onChange={(e) => handleFilterChange("isReaded", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Leído</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                        <option value="">Limpiar filtro: Leído</option>
                      </select>
                    </div>
    
                    <div className="flex items-center space-x-2">
                      <select
                        value={filterStatus.isSigned}
                        onChange={(e) => handleFilterChange("isSigned", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Firmado</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                        <option value="">Limpiar filtro: Firmado</option> 
                      </select>
                    </div>
                </div>
            )}
          </div>

          <div>
          {recibos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FaHeartBroken size={80} color="red" />
              <p className="text-center text-gray-400 mt-4">
                Lo lamentamos, no se han encontrado registros disponibles en esta página.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-blue-500 text-white m-auto">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Empleado</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Enviado</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Leído</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Firmado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {recibos.map((recibo) => (
                      <tr
                        key={recibo.id}
                        onClick={() => handleRowClick(recibo.id)}
                        className="border-b cursor-pointer hover:bg-gray-100"
                      >
                        <td className="px-6 py-4 text-blue-600">{recibo.type}</td>
                        <td className="px-6 py-4">{recibo.employeeFullName}</td>
                        <td className="px-6 py-4">{`${recibo.month}/${recibo.year}`}</td>
                        <td className="px-6 py-4 flex-col items-center space-x-2">
                          {recibo.isSended ? (
                            <FiCheckCircle className="text-green-500 m-auto" />
                          ) : (
                            <FiXCircle className="text-gray-400" />
                          )}
                          <span className="m-auto">{formatRelativeDate(recibo.sendedDate)}</span>
                        </td>
                        <td className="px-6 py-4">
                          {recibo.isReaded ? (
                            <FiCheckCircle className="text-green-500 m-auto" />
                          ) : (
                            <FiXCircle className="text-gray-400 m-auto" />
                          )}
                          <span className="m-auto">{formatRelativeDate(recibo.readedDate)}</span>
                        </td>
                        <td className="px-6 py-4">
                          {recibo.isSigned ? (
                            <FiCheckCircle className="text-green-500 m-auto" />
                          ) : (
                            <FiXCircle className="text-gray-400 m-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Controles de paginación */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handlePageChange(prevPage)}
                  disabled={!prevPage}
                  className="px-4 py-2 mx-2 text-gray-600 rounded-md disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-gray-700 font-semibold py-2">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(nextPage)}
                  disabled={!nextPage}
                  className="px-4 py-2 mx-2 text-gray-600 rounded-md disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
    </div>
  );
}