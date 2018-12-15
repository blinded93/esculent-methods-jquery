Rails.application.routes.draw do
  root 'home#index'
  post '/search' => 'search#index'
  post '/login' => 'sessions#create'
  post '/signup' => 'users#create'
  delete '/logout' => 'sessions#destroy'
  get '/current_user' => 'sessions#current_session_user'
  get '/recipes/search' => 'recipes#search'
  get '/ingredients/search' => 'recipes#ingredient_search'
  get '/users/search' => 'users#search'

  resources :recipes, only: [:index] do
    get '/favorited' => 'recipes#favorited'
    post '/favorite' => 'recipes#favorite'
    post '/share' => 'recipes#share'
  end

  resources :users, except: [:index] do
    get '/messages' => 'users#messages'
    get '/message_count' => 'messages#count'
    resources :messages, except: [:index, :new, :edit]
    delete '/messages' => 'messages#destroy'
    resources :recipes, except: [:index, :new, :edit]
    get '/recipes' => 'users#recipes'
    get '/favorites' => 'users#favorites'
    post '/friend' => 'users#friend'
    get '/friends' => 'users#friends'
    get '/friendships' => 'friendships#index'
    post '/messages/:id/read' => 'messages#read'
  end
end
