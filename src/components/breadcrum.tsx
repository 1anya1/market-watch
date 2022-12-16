import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { MdNavigateNext } from "react-icons/md";

const BreadCrums = (props: any) => {
  const { breadcrums } = props;
  return (
    <Breadcrumb spacing="8px" separator={<MdNavigateNext size={30} />}>
      {breadcrums.map((el: { href: string; name: string }, idx: number) => (
        <BreadcrumbItem key={idx}>
          <BreadcrumbLink
            href={el.href === "" ? "JavaScript:void(0);" : el.href}
          >
            {el.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
      s
    </Breadcrumb>
  );
};

export default BreadCrums;
