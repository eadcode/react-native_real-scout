import { useEffect } from "react";
import { Text, View, Image, TouchableOpacity, FlatList, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import seed from "@/lib/seed";
import NoResults from "@/components/NoResults";

const Explore = () => {
    const params = useLocalSearchParams<{ query?: string, filter?: string }>()

    const { data: properties, loading: propertiesLoading, refetch } = useAppwrite({
        fn: getProperties,
        params: { filter: params.filter!, query: params.query!, limit: 20 },
        skip: true
    })

    useEffect(() => {
        refetch({
            filter: params.filter!,
            query: params.query!,
            limit: 20
        })
    }, [params.filter, params.query]);

    const handleCardPress = (id: string) => router.push(`/properties/${ id }`)

    return (
        <SafeAreaView className="bg-white h-full">
            {/*<Button title="Seed" onPress={seed} />*/ }
            <FlatList
                data={ properties }
                renderItem={ ({ item }) => <Card item={ item } onPress={ () => handleCardPress(item.$id) } /> }
                keyExtractor={ (item) => item.$id }
                numColumns={ 2 }
                contentContainerClassName="pb-32"
                columnWrapperClassName="flex gap-5 px-5"
                showsVerticalScrollIndicator={ false }
                ListEmptyComponent={
                    propertiesLoading ? (
                        <ActivityIndicator size="large" className="text-primary-300 mt-5" />
                    ) : (
                        <NoResults />
                    )
                }
                ListHeaderComponent={
                    <View className="px-5">
                        <View className="flex flex-row items-center justify-between mt-5">
                            <TouchableOpacity className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center" onPress={ () => router.back() }>
                                <Image source={ icons.backArrow } className="size-5" />
                            </TouchableOpacity>
                            <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">Search for Your Ideal Home</Text>
                            <Image source={ icons.bell } className="w-6 h-6" />
                        </View>

                        <Search />

                        <View className="mt-5">
                            <Filters />

                            <Text className="mt-5 text-xl font-rubik-bold text-black-300">
                                Found { properties?.length } Properties
                            </Text>
                        </View>

                    </View>
                }
            />
        </SafeAreaView>
    );
}

export default Explore;
