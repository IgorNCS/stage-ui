import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Badge } from '@chakra-ui/react';
import { brlFormat } from '@/utils';
import { format } from 'date-fns';
import { useHiddenMoney } from '@/context/hiddenMoney';

interface Transaction {
  owner: string;
  type: string;
  amount: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  const { memoizedValue } = useHiddenMoney();

  return (
    <Box overflowX="auto" mt={4}>
      <Table colorScheme="blackAlpha" variant="striped">
        <Thead>
          <Tr>
            <Th>DATA/HORA EFETIVAÇÃO</Th>
            <Th>CLIENTE</Th>
            <Th>CRÉDITO/DÉBITO</Th>
            <Th isNumeric>VALOR</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions?.map((transaction, index) => (
            <Tr key={index}>
              <Td>
                {format(new Date(transaction.createdAt), 'dd/MM/Y HH:mm:ss')}
              </Td>
              <Td>{transaction.owner}</Td>
              <Td>
                {transaction.type === 'D' ? (
                  <Badge
                    colorScheme="red"
                    variant="solid"
                    minWidth="75px"
                    display="inline-block"
                    textAlign="center"
                  >
                    Débito
                  </Badge>
                ) : (
                  <Badge
                    colorScheme="green"
                    variant="solid"
                    minWidth="75px"
                    display="inline-block"
                    textAlign="center"
                  >
                    Crédito
                  </Badge>
                )}
              </Td>
              <Td isNumeric>
                {memoizedValue ? brlFormat(+transaction.amount) : '* * *'}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TransactionTable;
