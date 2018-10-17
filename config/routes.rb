Rails.application.routes.draw do
  root 'home#index'
  post '/search' => 'search#index'
  post '/login' => 'sessions#create'
  post '/signup' => 'users#create'
  delete '/logout' => 'sessions#destroy'
  get '/current_user' => 'sessions#current_session_user'
  get '/recipe_search' => 'recipes#search'
  get '/ingredient_search' => 'recipes#ingredient_search'
  get '/user_search' => 'users#search'

  resources :recipes, only: [:index] do
    get '/favorited' => 'recipes#favorited'
    post '/favorite' => 'recipes#favorite'
  end

  resources :users, except: [:index] do
    get '/messages' => 'users#messages'
    resources :messages, except: [:index, :destroy, :new, :edit]
    delete '/messages' => 'messages#destroy'
    resources :recipes, except: [:index, :new, :edit]
    get '/recipes' => 'users#recipes'
    get '/favorites' => 'users#favorites'
    get '/friends' => 'users#friends'
  end
end
