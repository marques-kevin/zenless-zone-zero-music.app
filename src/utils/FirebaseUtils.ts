export class FirebaseUtils {
  mapQuerySnapshot<T>(querySnapshot: any): Array<T> {
    const data: any[] = []

    querySnapshot.forEach((doc: any) => data.push(doc.data()))

    return data
  }
}
