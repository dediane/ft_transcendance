// import { useState } from 'react'
// import  axios  from 'axios'
// import {
//   Box,
//   Flex,
//   Stack,
//   Heading,
//   Text,
//   Container,
//   Input,
//   Button,
//   SimpleGrid,
//   Avatar,
//   AvatarGroup,
//   useBreakpointValue,
//   IconProps,
//   Icon,
// } from '@chakra-ui/react';

// const avatars = [
//   {
//     name: 'Marie-Inès Loubet',
//     url: 'https://cdn.intra.42.fr/users/3f9352613c9eeb943d1bef017a9a6d1c/mloubet.jpg',
//   },
//   {
//     name: 'Diane Decourt',
//     url: 'https://cdn.intra.42.fr/users/e31d9227791fbb569b7003a9fea07b81/ddecourt.jpg',
//   },
//   {
//     name: 'Balkis Ben Yaagoub',
//     url: 'https://cdn.intra.42.fr/users/7f2711f31bea8caf489d89a2b1705a5d/bben-yaa.jpg',
//   },
// ];

// export default function JoinOurTeam() {

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSumit = async (event: Event) => {
//     event.preventDefault();

//     const teamPayload = {
//       username,
//       email,
//       password
//     }
// // Todo : some validation (email is an email...)

//     console.log("Payload: ", teamPayload)


//     try {
//         const { data } = await axios({
//           url: "/api/teamadd",
//           method: "POST",
//           data: teamPayload,
//         });
//         console.log("Response Back: ", data);
//     }
//     catch (error) {
//       console.log("Error: ", error);
//     }
//   }

//   return (
//     <Box position={'relative'}>
//       <Container
//         as={SimpleGrid}
//         maxW={'7xl'}
//         columns={{ base: 1, md: 2 }}
//         spacing={{ base: 10, lg: 30 }}
//         py={{ base: 10, sm: 20, lg: 32 }}>
//         <Stack spacing={{ base: 10, md: 20 }} paddingLeft={6}>
//           <Heading
//             lineHeight={1.1}
//             fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
//             Our Ft_Transcendence{' '}
//             <Text
//               as={'span'}
//               bgGradient="linear(to-r, blue.400,blue.600)"
//               bgClip="text">
//               From
//             </Text>{' '}
//             42 Paris School
//           </Heading>
//           <Stack direction={'row'} spacing={4} align={'center'}>
//             <AvatarGroup>
//               {avatars.map((avatar) => (
//                 <Avatar
//                   key={avatar.name}
//                   name={avatar.name}
//                   src={avatar.url}
//                   size={useBreakpointValue({ base: 'md', md: 'lg' })}
//                   position={'relative'}
//                   zIndex={2}
//                   _before={{
//                     content: '""',
//                     width: 'full',
//                     height: 'full',
//                     rounded: 'full',
//                     transform: 'scale(1.125)',
//                     bgGradient: 'linear(to-bl, blue.600,blue.500)',
//                     position: 'absolute',
//                     zIndex: -1,
//                     top: 0,
//                     left: 0,
//                   }}
//                 />
//               ))}
//             </AvatarGroup>
//             <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
//               +
//             </Text>
//             <Flex
//               align={'center'}
//               justify={'center'}
//               fontFamily={'heading'}
//               fontSize={{ base: 'sm', md: 'lg' }}
//               bg={'gray.800'}
//               color={'white'}
//               rounded={'full'}
//               minWidth={useBreakpointValue({ base: '44px', md: '60px' })}
//               minHeight={useBreakpointValue({ base: '44px', md: '60px' })}
//               position={'relative'}
//               _before={{
//                 content: '""',
//                 width: 'full',
//                 height: 'full',
//                 rounded: 'full',
//                 transform: 'scale(1.125)',
//                 bgGradient: 'linear(to-bl, blue.500,blue.400)',
//                 position: 'absolute',
//                 zIndex: -1,
//                 top: 0,
//                 left: 0,
//               }}>
//               YOU
//             </Flex>
//           </Stack>
//         </Stack>
//         <Stack
//           bg={'gray.50'}
//           rounded={'xl'}
//           p={{ base: 4, sm: 6, md: 8 }}
//           spacing={{ base: 8 }}
//           maxW={{ lg: 'lg' }}>
//           <Stack spacing={4}>
//             <Heading
//               color={'gray.800'}
//               lineHeight={1.1}
//               fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
//               Join our team
//               <Text
//                 as={'span'}
//                 bgGradient="linear(to-r, blue.400,blue.600)"
//                 bgClip="text">
//                 !
//               </Text>
//             </Heading>
//             <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
//               We’re looking for amazing Pong player just like you! Become a part
//               of our rockstar gaming team !
//             </Text>
//           </Stack>
//           <Box as={'form'} mt={10}>
//             <Stack spacing={4}>
//               {/* <Input
//                 placeholder="Username"
//                 value={ username }
//                 onChange={({target}) => setUsername(target?.value)}
//                 bg={'gray.100'}
//                 border={0}
//                 color={'gray.500'}
//                 _placeholder={{
//                   color: 'gray.500',
//                 }}
//                 /> */}
//               <Input
//                 placeholder="Username@lastname.io"
//                 value={ email }
//                 onChange={({target}) => setEmail(target?.value)}
//                 bg={'gray.100'}
//                 border={0}
//                 color={'gray.500'}
//                 _placeholder={{
//                   color: 'gray.500',
//                 }}
//                 />
//               <Input
//                 placeholder="Password"
//                 value={ password }
//                 type={'password'}
//                 onChange={({target}) => setPassword(target?.value)}
//                 bg={'gray.100'}
//                 border={0}
//                 color={'gray.500'}
//                 _placeholder={{
//                   color: 'gray.500',
//                 }}
//               />
//             </Stack>
//             <Button
//             onClick={handleSumit}
//               fontFamily={'heading'}
//               mt={8}
//               w={'full'}
//               bgGradient="linear(to-r, blue.600,blue.400)"
//               color={'white'}
//               _hover={{
//                 bgGradient: 'linear(to-r, blue.400,blue.600)',
//                 boxShadow: 'xl',
//               }}>
//               Log in
//             </Button>
//             <Button
//               fontFamily={'heading'}
//               mt={8}
//               w={'full'}
//               bgGradient="linear(to-r, blue.600,blue.400)"
//               color={'white'}
//               _hover={{
//                 bgGradient: 'linear(to-r, blue.400,blue.600)',
//                 boxShadow: 'xl',
//               }}>
//               Connect with 42
//             </Button>
//           </Box>
//           form
//         </Stack>
//       </Container>
//     </Box>
//   );
// };