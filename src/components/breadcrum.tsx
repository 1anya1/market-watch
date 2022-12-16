import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { MdNavigateNext } from "react-icons/md";

const BreadCrums = (props: any) => {
  console.log({ props });
  const { breadcrums } = props;
  return (
    <Breadcrumb
      spacing="8px"
      separator={<MdNavigateNext size={30} />}
      position="relative"
      zIndex="12"
    >
      {breadcrums.map((el: { href: string; name: string }, idx: number) => (
        <BreadcrumbItem key={idx}>
          <BreadcrumbLink href={el.href === "" ? undefined : el.href}>
            {el.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
      s
    </Breadcrumb>
  );
};

export default BreadCrums;
