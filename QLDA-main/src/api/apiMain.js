import { axiosClient, axiosInstance } from "./axiosClient";
import getData from './getData'
const apiMain = {

    ///authentication
    login: async (params) => {
        const res = await axiosClient.post('/auth/login', params)
        return res.data;
    },
    register: async (params) => {
        const res = await axiosClient.post('/auth/register', params)
        return res.data;
    },
    forgetPassword: async (params) => {
        const res = await axiosClient.post('/auth/forgetpassword', params)
        return getData(res);
    },
    reActive: async (params) => {
        const res = await axiosClient.post('/auth/reactive', params)
        return getData(res);
    },
    verifyToken: async (user, dispatch, stateSuccess) => {
        const url = `/auth/verifytoken`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return (await axi.get(url, { headers: { Authorization: `Bearer ${user.accessToken}` } })).data;
    },
    checkUsername:async (params) => {
        const res = await axiosClient.get('/auth/checkusername', {params})
        return getData(res);
    },
    checkEmail:async (params) => {
        const res = await axiosClient.get('/auth/checkemail', {params:params})
        return getData(res);
    },

    ///get data

    getStorys: async (params) => {
        const res = await axiosClient.get(`/novels/`, { params: params });
        return getData(res);

    },
    getStorysByName: async (params) => {
        const res = await axiosClient.get(`/novels/search`, { params: params });
        return getData(res);

    },
    getStorysByUsername: async (params) => {
        const res = await axiosClient.get(`/novels/created`, { params: params });
        return getData(res);
    },
    getStory: async (params) => {
        const res = await axiosClient.get(`/novels/novel/${params.url}`);
        return getData(res);

    },
    getChapters: async (url, params) => {
        const res = await axiosClient.get(`/novels/novel/${url}/chuong`, { params: params });
        return getData(res);

    },
    getNameChapters: async (url, params) => {
        const res = await axiosClient.get(`/novels/novel/${url}/mucluc`, { params: params });
        return getData(res);
    },
    getChapterByNumber: async (tentruyen, chapnum) => {
        return getData(await axiosClient.get(`/novels/novel/${tentruyen}/chuong/${chapnum}`));
    },
    getChapterByNumberAndSetReading: async (tentruyen, chapnum, user, dispatch, stateSuccess) => {
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.get(`/novels/novel/${tentruyen}/chuong/${chapnum}`));
    },
    createChapter: async (params, user, dispatch, stateSuccess) => {
        const url = `/novels/novel/chuong/create`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.post(url, params));
    },
    updateChapter: async (params, user, dispatch, stateSuccess) => {
        const url = `/novels/novel/chuong/edit`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put(url, params));
    },

    deleteChapter: async (params, user, dispatch, stateSuccess) => {
        const url = `/novels/novel/chuong`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.delete(url, { params }));
    },
    getReadings: async (user, dispatch, stateSuccess) => {
        const url = `/novels/readings`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.get(url, { headers: { Authorization: `Bearer ${user.accessToken}` } }));
    },
    getReadingDefault: async (params) => {
        const url = `/novels/readingsdefault`
        return getData(await axiosClient.get(url, {params} ));
    },
    getSaveds: async (user, dispatch, stateSuccess) => {
        const url = `/saved`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.get(url, { headers: { Authorization: `Bearer ${user.accessToken}` } }));
    },
    createStory: async (params, user, dispatch, stateSuccess) => {
        const url = `/novels/novel/create`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return (await axi.post(url, params)).data;
    },
    updateStory: async (params, user, dispatch, stateSuccess) => {
        const url = `/novels/novel/edit`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put(url, params));
    },
    deleteStory: async (params, user, dispatch, stateSuccess) => {
        const url = `/novels/novel`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.delete(url, {params}));
    },
    getChapterNewUpdate: async (param) => {
        return getData(await axiosClient.get(`/novels/novel/newupdate`,{param}));
    },
    ///Comment

    createComment: async (user, params, dispatch, stateSuccess) => {
        const url = `/comment`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.post(url, params, { headers: { Authorization: `Bearer ${user.accessToken}` } }));
    },
    getCommentsByUrl: async (url,params) => {
        return getData(await axiosClient.get(`/comment/${url}`,{params}));
    },
    deleteComment: async (user, params, dispatch, stateSuccess) => {
        const url = `/comment/${params.id}`
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.delete(url, { headers: { Authorization: `Bearer ${user.accessToken}` } }));
    },

    ///user

    getAllUser: async (user, dispatch, stateSuccess) => {
        const url = 'admin/users'
        let axi = axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.get(url, { headers: { Authorization: `Bearer ${user.accessToken}` }, }));
    },

    refreshToken: async (user) => {
        const params = { refreshToken: user.refreshToken }
        const res = await axiosClient.post('/auth/refreshtoken', params, { headers: { Authorization: `Bearer ${user.accessToken}` }, })
        return res.data
    },

    getUserInfo: async (user, dispatch, stateSuccess) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return await axi.get('/user/info', { headers: { Authorization: `Bearer ${user.accessToken}` } });
    },
    updateUserInfo: async (user, dispatch, stateSuccess, params) => {

        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put('/user/info', params, { headers: { Authorization: `Bearer ${user.accessToken}` } }));

    },

    ChangePassword: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put('/user/info/password', params, { headers: { Authorization: `Bearer ${user.accessToken}` } }));

    },
    activeAccount: async (params) => {
        const res = await axiosClient.get(`/auth/active`, { params: params });
        return res.data;
    },
    activeByAdmin: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put(`admin/user/active`, params))
    },
    inactiveByAdmin: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put(`admin/user/inactive`, params))
    },
    updateRole: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.put('admin/role/updatetouser', params));
    },
    deleteAccount: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.delete(`admin/user`, { headers: { Authorization: `Bearer ${user.accessToken}` },data:params }));
    },

    ///saved
    checkSaved: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.get(`/saved/${params.url}`, { headers: { Authorization: `Bearer ${user.accessToken}` } }));
    },
    savedStory: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.post(`/saved/`, params,{ headers: { Authorization: `Bearer ${user.accessToken}` } }));
    },
    unsavedStory: async (user, dispatch, stateSuccess, params) => {
        const axi = await axiosInstance(user, dispatch, stateSuccess)
        return getData(await axi.delete(`/saved`,{ headers: { Authorization: `Bearer ${user.accessToken}` },data:params }));
    },
}
export default apiMain;